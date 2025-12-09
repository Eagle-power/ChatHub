import express from "express";
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import Filter from "bad-words";
import { config } from "./config";
import { Message, User } from "./interfaces";

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);



const io = new Server(httpServer, {
    cors: {
        origin: [config.clientUrl , "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

const SECRET_KEY = config.jwtSecret;

const filter = new Filter();
filter.addWords("sex", "nude", "naked", "horny", "xxx");

const sessions = new Map<string, User>();
const messages: Message[] = [];

const bannedDevices = new Set<string>();
const bannedIPs = new Set<string>();
const ipViolationCounts = new Map<string, number>();

const getClientIp = (socket: any) => {
    // Check headers for proxies (like Nginx/Cloudflare) or fallback to direct connection
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    // Handle localhost IPv6 format (::1) or mapped IPv4 (::ffff:127.0.0.1)
    return ip === '::1' ? '127.0.0.1' : ip;
};

// middleware definition
io.use((socket, next) => {

    // checking for if this ip has been banned before or not
    const ip = getClientIp(socket);
    if (bannedIPs.has(ip)) {
        console.log(`Blocked connection from banned IP: ${ip}`);
        return next(new Error("You are banned from this server."));
    }

    const token = socket.handshake.auth.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY) as User;

            if (bannedDevices.has(decoded.deviceId)) {
                return next(new Error("This device is banned."));
            }


            socket.data.user = decoded;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
});

io.on("connection", (socket) => {
    const ip = getClientIp(socket);

    // Reconnection logic
    if (socket.data.user) {
        const user = socket.data.user;

        // Check if this user is banned before allowing restore
        if (bannedDevices.has(user.deviceId) || bannedIPs.has(ip)) {
            console.log(`Banned user tried to reconnect: ${user.username}`);
            socket.emit("banned", "You are permanently banned from this server.");
            socket.disconnect(true);
            return;
        }

        const updatedUser = { ...user, socketId: socket.id };
        sessions.set(user.id, updatedUser);

        socket.emit("sessionRestored", {
            sessionID: user.id,
            username: user.username,
            messages: messages,
            users: Array.from(sessions.values())
        });
        io.emit("userList", Array.from(sessions.values()));
    }

    // --- EVENTS ---

    socket.on("join", (username: string) => {
        // gettiing the device id from handshaking..
        const deviceId = socket.handshake.auth.deviceId;
        const currentIp = getClientIp(socket);

        //  CHECK IF BANNED
        if (deviceId && bannedDevices.has(deviceId) || bannedIPs.has(currentIp)) {
            console.log(`Rejected join request from banned device: ${deviceId}`);
            socket.emit("banned", "This device is permanently banned.");
            socket.disconnect(true);
            return;
        }

        for (const [existingUserId, existingUser] of sessions.entries()) {
            if (existingUser.deviceId === deviceId) {
                console.log(`Removing stale session for ${existingUser.username}`);
                sessions.delete(existingUserId);
                // In case we  want to force disconnect the OLD socket (if it's still open)
                // io.sockets.sockets.get(existingUser.socketId)?.disconnect(true);
            }
        }

        const userId = randomUUID();
        const newUser: User = {
            id: userId,
            username: username,
            socketId: socket.id,
            deviceId: deviceId
        };

        // Attach user to socket for easier access later
        socket.data.user = newUser;

        const token = jwt.sign(newUser, SECRET_KEY);
        sessions.set(userId, newUser);

        socket.emit("sessionCreated", {
            token: token,
            userId: userId,
            username: username,
            messages: messages,
            users: Array.from(sessions.values())
        });

        io.emit("userList", Array.from(sessions.values()));
        io.emit("userJoined", username);
    });

    socket.on("sendMessage", (message: string) => {
        // Retrieve User
        const user = socket.data.user || sessions.get(Array.from(sessions.entries()).find(([, u]) => u.socketId === socket.id)?.[0] || "");
        const currentIp = getClientIp(socket);

        if (user) {
            if (filter.isProfane(message)) {

                // 1. Increment Violation Count
                const currentCount = (ipViolationCounts.get(currentIp) || 0) + 1;
                ipViolationCounts.set(currentIp, currentCount);

                console.log(`Profanity detected. User: ${user.username}, IP: ${currentIp}, Count: ${currentCount}`);

                // 2. CHECK THRESHOLDS

                // --- LEVEL 3: IP BAN (6th Attempt) ---
                if (currentCount >= 6) {
                    bannedIPs.add(currentIp); // Ban the Network

                    // Ban device too just to be sure
                    if (user.deviceId) bannedDevices.add(user.deviceId);

                    cleanupUser(user);
                    socket.emit("banned", "IP BANNED: You ignored the final warning.");
                    socket.disconnect(true);
                    return;
                }

                // --- LEVEL 2: FINAL WARNING (5th Attempt) ---
                if (currentCount === 5) {
                    // Send a special "warning" event, NOT a ban
                    socket.emit("warning", "CRITICAL WARNING: You have violated our policy 5 times. ONE more violation will result in a permanent IP BAN.");
                    return; // Do not send the message, but don't disconnect yet
                }

                // --- LEVEL 1: DEVICE BAN (3rd Attempt) ---
                if (currentCount === 3) {
                    if (user.deviceId) bannedDevices.add(user.deviceId); // Ban this specific browser

                    cleanupUser(user);
                    socket.emit("banned", "DEVICE BANNED: You violated the policy 3 times. You are removed.");
                    socket.disconnect(true);
                    return;
                }

                // --- LEVEL 0: MILD WARNING (1st & 2nd, 4th Attempt) ---
                const attemptsLeft = currentCount < 3 ? (3 - currentCount) : (6 - currentCount);
                const target = currentCount < 3 ? "Device Ban" : "IP Ban";

                socket.emit("warning", `Profanity detected! That message was blocked. ${attemptsLeft} more strikes until ${target}.`);
                return; // Stop execution
            }

            // Normal Message Logic
            const msg: Message = {
                user: {
                    id: user.id,
                    username: user.username,
                    socketId: socket.id,
                    deviceId: user.deviceId
                },
                message,
                timestamp: new Date(),
                deviceId: user.deviceId
            };
            messages.push(msg);
            io.emit("newMessage", msg);
        }
    });

    const cleanupUser = (user: User) => {
        sessions.delete(user.id);
        // Purge history
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].user.id === user.id) messages.splice(i, 1);
        }
        io.emit("messageHistory", messages);
        io.emit("userList", Array.from(sessions.values()));
        io.emit("userLeft", user.username);
    };

    socket.on("userLeft", (username) => {
        if (socket.data.user) {
            sessions.delete(socket.data.user.id);
            io.emit("userList", Array.from(sessions.values()));
            io.emit("userLeft", username);
        }
    });

    socket.on("disconnect", () => {
        if (socket.data.user) {
            sessions.delete(socket.data.user.id);
            io.emit("userList", Array.from(sessions.values()));
        }
    });
});

const PORT = config.port;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});