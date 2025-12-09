import { useEffect, useState } from "react";
import type { User, Message } from "./interfaces";
import { socket, updateDeviceActivity, getDeviceId } from "./services/socket"; // Added getDeviceId import
import Login from "./components/Login";
import Chat from "./components/chat";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [initialUsers, setInitialUsers] = useState<User[]>([]);

  // 1. DEVICE ACTIVITY TIMER LOGIC
  useEffect(() => {
    updateDeviceActivity();

    const interval = setInterval(() => {
      if (currentUser) {
        updateDeviceActivity();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // 2. SOCKET & SESSION LOGIC
  useEffect(() => {
    const token = sessionStorage.getItem("chat_token");
    if (token) {
      socket.connect();
    }

    // Listen for Token Creation (New Login success)
    const onSessionCreated = ({
      token,
      userId,
      username,
      messages,
      users,
    }: any) => {
      sessionStorage.setItem("chat_token", token);
      setInitialMessages(messages || []);
      setInitialUsers(users || []);

      // FIXED: Construct the full User object
      setCurrentUser({
        id: userId,
        username: username,
        deviceId: getDeviceId(),     // Get the persistent Device ID
        socketId: socket.id || ""    // Get the current Socket ID
      });
    };

    // Listen for Restore (Reconnect / Refresh success)
    const onSessionRestored = ({
      sessionID,
      username,
      messages,
      users,
    }: any) => {
      setInitialMessages(messages);
      setInitialUsers(users);

      // FIXED: Construct the full User object
      setCurrentUser({
        id: sessionID,
        username: username,
        deviceId: getDeviceId(),     // Get the persistent Device ID
        socketId: socket.id || ""    // Get the current Socket ID
      });
    };

    socket.on("sessionCreated", onSessionCreated);
    socket.on("sessionRestored", onSessionRestored);

    return () => {
      socket.off("sessionCreated", onSessionCreated);
      socket.off("sessionRestored", onSessionRestored);
    };
  }, []);

  const handleLogin = (username: string) => {
    updateDeviceActivity();
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("join", username);
  };

  const handleLogout = (username: string) => {
    updateDeviceActivity();
    socket.emit("userLeft", username);
    socket.disconnect();
    sessionStorage.removeItem("chat_token");
    setCurrentUser(null);
    setInitialMessages([]);
    setInitialUsers([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat
          currentUser={currentUser}
          onLogout={handleLogout}
          initialMessages={initialMessages}
          initialUsers={initialUsers}
        />
      )}
    </div>
  );
}

export default App;