import express from "express"; 
import { config } from "./config";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken"; // Import JWT
import { Message, User } from "./interfaces";
 

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// SECRET KEY: In production, put this in .env
const SECRET_KEY = config.jwtSecret

// Active sessions (Only for the User List/Sidebar)
const sessions = new Map<string, User>();
const messages: Message[] = [];

// MIDDLEWARE: Verify the Token
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (token) {
        try {
            // VERIFY: Check if the token was signed by us
            const decoded = jwt.verify(token, SECRET_KEY) as User;
            

            // If valid, attach data to socket
            socket.data.user = decoded;
            return next();
        } catch (err) {
            // Token is invalid or expired
            console.log("Invalid token");
            return next();
        }
    }
    next();
});

io.on("connection", (socket) => {
    // RECONNECTION LOGIC
    // If middleware found a valid token, socket.data.user exists
    if (socket.data.user) {
        const user = socket.data.user;

        // Add them back to the active list (in case server restarted)
        // We update the socketId to the new connection
        const updatedUser = { ...user, socketId: socket.id };
        sessions.set(user.id, updatedUser);

        console.log(`User restored via Token: ${user.username}`);

        // Send them the state
        socket.emit("sessionRestored", {
            sessionID: user.id, // ID from the token
            username: user.username,
            messages: messages,
            users: Array.from(sessions.values())
        });

        // Tell everyone else they are online
        io.emit("userList", Array.from(sessions.values()));
    }

    // --- NEW LOGIN ---

    const deviceId = socket.handshake.auth.deviceId;

    socket.on("join", (username: string) => {
        const userId = randomUUID();

        const newUser: User = {
            id: userId,
            username: username,
            socketId: socket.id,
            deviceId: deviceId // <--- STORE IT
        };

        const token = jwt.sign(newUser, SECRET_KEY);
        sessions.set(userId, newUser);

        // (No changes needed to the emits, just saving the user correctly)
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

    // UPDATE SEND MESSAGE LOGIC
    socket.on("sendMessage", (message: string) => {
        const user = socket.data.user || sessions.get(Array.from(sessions.entries()).find(([, u]) => u.socketId === socket.id)?.[0] || "");

        if (user) {
            const msg: Message = {
                user: {
                    id: user.id,
                    username: user.username,
                    socketId: socket.id,
                    deviceId: user.deviceId // Include in nested user object if needed
                },
                message,
                timestamp: new Date(),
                deviceId: user.deviceId // <--- STAMP THE MESSAGE
            };
            messages.push(msg);
            io.emit("newMessage", msg);
        }
    });

    socket.on("userLeft", (username) => {
        // Manual Logout
        if (socket.data.user) {
            sessions.delete(socket.data.user.id);
            io.emit("userList", Array.from(sessions.values()));
            io.emit("userLeft", username);
        }
    });

    socket.on("disconnect", () => {
        // For the user list, we remove them from RAM so they don't appear "Online"
        // BUT we don't invalidate their token. If they come back, the token works.
        if (socket.data.user) {
            // Optional: You might want to keep them in the list for a bit (debounce), 
            // but strictly speaking for "Online Users", they are offline now.
            sessions.delete(socket.data.user.id);
            io.emit("userList", Array.from(sessions.values()));
            // We don't need to emit 'userLeft' if we want them to stay "ghosted", 
            // but usually you want to show they disconnected.
        }
    });
});

const PORT = config.port
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});