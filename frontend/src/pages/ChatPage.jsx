import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { io } from "socket.io-client";
import { useEffect } from "react";

let socket = io(import.meta.env.VITE_BASE_URL);

function ChatPage() {
    const [user, setUser] = useState(null);//stores the currently selected user (whose chat is open).
    const [users, setUsers] = useState([]);//this stores total number of users and their data and last msg
    const [onlineUsers, setOnlineUsers] = useState({});//stores current all online users
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("onlineUsers", (users) => {
            setOnlineUsers(users.onlineUsers);
        });
        //all users except current user and their messages
        socket.on("newMessage", (data) => {
            //here we use "setUsers" because we need to update last message in the sidebar live
            //this updates the existing "users" array, no need to call everytime /user/all
            setUsers(prev => prev.map(user => {
                if (user._id === data.senderId || user._id === data.receiverId) {
                    return { ...user, lastMessage: data }
                }
                return user;
            }));
        });

        return () => {
            socket.off("onlineUsers");//remove event listener onlineUsers
            socket.off("newMessage");//remove event listener newMessage
            // socket.disconnect();//completely remove socket connection
        }
    }, []);
    return <>
        <div className="flex h-screen">
            <Sidebar selectedUser={user} setSelectedUser={setUser} users={users} setUsers={setUsers} socket={socket} />
            <ChatWindow selectedUser={user} socket={socket} onlineUsers={onlineUsers} messages={messages} setMessages={setMessages} />
        </div>
    </>
}

export default ChatPage;