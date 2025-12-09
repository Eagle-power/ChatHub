import { useEffect, useState } from "react";
import type { User, Message } from "./interfaces";
import { socket, updateDeviceActivity, getDeviceId } from "./services/socket"; // Added getDeviceId import
import Login from "./components/Login";
import Chat from "./components/chat";
import Terms from "./components/TermAndCondition";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [initialUsers, setInitialUsers] = useState<User[]>([]);

  const [viewingTerms, setViewingTerms] = useState(false);

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

    const onBanned = (reason: string) => {
      alert(reason); // Show popup: "You have been banned..."

      // Clear Local Data
      sessionStorage.removeItem("chat_token");

      // Reset State
      setCurrentUser(null);
      setInitialMessages([]);
      setInitialUsers([]);
    };
    const onWarning = (message: string) => {
      alert(message);
    };


    const onConnectError = (err: Error) => {
        // This catches the "You are banned" error from the server middleware
        if (err.message.includes("banned")) {
            alert(err.message); // Show: "You are banned from this server"
            sessionStorage.removeItem("chat_token"); // Clear token so they don't loop
        }
        console.log("Connection failed:", err.message);
    };

    socket.on("sessionCreated", onSessionCreated);
    socket.on("sessionRestored", onSessionRestored);
    socket.on("banned", onBanned);
    socket.on("warning", onWarning);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("sessionCreated", onSessionCreated);
      socket.off("sessionRestored", onSessionRestored);
      socket.off("banned" , onBanned);
      socket.off("warning", onWarning);
      socket.off("connect_error", onConnectError);
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

  if (viewingTerms) {
    return <Terms onBack={() => setViewingTerms(false)} />;
  }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!currentUser ? (
        <Login onLogin={handleLogin} onShowTerms={() => setViewingTerms(true)} />
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