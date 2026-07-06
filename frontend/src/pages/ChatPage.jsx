import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:4000");

function ChatPage() {
    const [user, setUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("onlineUsers", (users) => {
            setOnlineUsers(users.onlineUsers);
        });

        return () => {
            socket.off("onlineUsers");
        }
    }, []);
    return <>
        <div className="flex h-screen">
            <Sidebar selectedUser={user} setSelectedUser={setUser} messages={messages} />
            <ChatWindow selectedUser={user} socket={socket} onlineUsers={onlineUsers} messages={messages} setMessages={setMessages} />
        </div>
    </>
}

export default ChatPage;