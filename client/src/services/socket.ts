import { default as io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid'; 

const URL = "http://localhost:8080";
const EXPIRY_TIME_MS = 5 * 60 * 1000; // 5 Minutes

// Helper to manage the Device ID with Expiry
export const getDeviceId = () => {
    const stored = localStorage.getItem("device_session");
    
    if (stored) {
        const { id, lastActive } = JSON.parse(stored);
        const now = Date.now();

        // CHECK: Has it been more than 5 mins since last active?
        if (now - lastActive < EXPIRY_TIME_MS) {
            // Valid! Update the timestamp so it stays valid
            updateDeviceActivity(id);
            return id;
        } else {
            console.log("Device ID expired. Generating new identity.");
            // Expired! Fall through to generate new ID
        }
    }

    // Generate New ID
    const newId = uuidv4();  
    updateDeviceActivity(newId);
    return newId;
};

// Call this function whenever the user does something (Login, Message, etc.)
// to keep their session alive.
export const updateDeviceActivity = (existingId?: string) => {
    let id = existingId;
    if (!id) {
        // Try to get existing ID to update it
        const stored = localStorage.getItem("device_session");
        if (stored) id = JSON.parse(stored).id;
    }

    if (id) {
        const data = {
            id: id,
            lastActive: Date.now() // Reset the 5-minute timer
        };
        localStorage.setItem("device_session", JSON.stringify(data));
    }
}

export const socket: typeof Socket = io(URL, {
    autoConnect: false,
    reconnection: true,
    auth: (cb : (data : object) => void) => {
        const token = sessionStorage.getItem("chat_token");
        // Always get a valid (possibly new) ID
        const deviceId = getDeviceId(); 
        cb({ token, deviceId });
    }
});