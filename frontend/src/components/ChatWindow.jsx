import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";


function ChatWindow({ selectedUser, socket, onlineUsers, messages, setMessages }) {
    const [sendMessage, setSendMessage] = useState("");
    const bottom = useRef(null);

    // Logged in user id
    const myUserId = localStorage.getItem("myUserId");

    // Fetch messages when selected user changes
    useEffect(() => {
        async function getMessages() {
            if (!selectedUser) return;

            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/message/getmessage/${selectedUser._id}`,
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );

            setMessages(response.data.response);
        }

        getMessages();
    }, [selectedUser]);

    // Register socket
    useEffect(() => {
        socket.emit("registerUser", myUserId);
    }, []);

    // Listen for live messages
    useEffect(() => {
        const listener = (data) => {
            //It will only add the message if it is from the selected user or the current user
            if (data.senderId === selectedUser?._id || data.senderId === myUserId) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socket.on("newMessage", listener);

        return () => {
            socket.off("newMessage", listener);
        };
    }, [socket, selectedUser]);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        bottom.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    function sendMsg() {
        // Empty message
        if (!sendMessage.trim()) return;

        // No user selected
        if (!selectedUser) return;

        const data = {
            content: sendMessage,
            senderId: myUserId,
            receiverId: selectedUser._id,
        };

        socket.emit("sendMessage", data);
        setSendMessage("");
    }

    return (
        <div className="flex-1 flex flex-col bg-orange-50">
            {/* Header */}
            {selectedUser && <div className="h-20 bg-white border-b border-orange-100 px-6 flex items-center shadow-sm">
                {/* User Header */}
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <img
                        src="https://api.dicebear.com/9.x/adventurer/svg?seed=Felix"
                        className="w-14 h-14 rounded-full object-cover"
                    />

                    {/* User Name & Status */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {selectedUser?.name}
                        </h2>

                        <p className="text-sm text-green-500">
                            {onlineUsers[selectedUser?._id] ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
            </div>}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-orange-50">

                {
                    // Check if messages exist
                    messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Start your conversation 👋
                        </div>
                    ) :
                        // it will show messages
                        messages.map((message) => (

                            //will show message
                            <div
                                key={message._id}
                                className={`flex ${message.senderId === myUserId
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >

                                <div
                                    className={`px-5 py-4 rounded-3xl max-w-md shadow-sm ${message.senderId === myUserId
                                        ? "bg-orange-500 text-white shadow-md"
                                        : "bg-white text-gray-800 shadow"
                                        }`}
                                >
                                    {/* for message showing */}
                                    <p className="text-[15px] leading-relaxed">{message.content}</p>

                                    {/* will show message time */}
                                    <p
                                        className={`text-[11px] opacity-70 mt-2 ${message.senderId === myUserId
                                            ? "text-gray-100"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                <div ref={bottom} />  {/* put this here, after the map */}

            </div>

            {/* Input */}
            {selectedUser && <div className="sticky bottom-0 border-t bg-white p-4 flex gap-3">
                <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                    value={sendMessage}
                    onChange={(e) => setSendMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMsg();
                    }}
                />

                <button
                    onClick={sendMsg}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-full transition"
                >
                    <IoMdSend />
                </button>
            </div>}
        </div>
    );
}

export default ChatWindow;