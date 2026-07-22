import { useEffect, useState } from "react";
import SidebarCard from "./SidebarCard";
import axios from "axios";
import { FiLogOut } from "react-icons/fi";

function Sidebar({ selectedUser, setSelectedUser, users, setUsers, socket }) {
    //get users from /user/all and token from localStorage

    useEffect(() => {
        async function getUsers() {

            try {
                const response = await axios.get(import.meta.env.VITE_BASE_URL + "/user/all", {
                    headers: {
                        token: localStorage.getItem("token")
                    }
                });
                //here we use "setUsers" to get all users when the sidebar mounts
                //to get all the users for the first time and store it in "users"
                setUsers(response.data.users);

            } catch (err) {
                console.log("Error when fetching the users", err);
            }

        }
        getUsers();
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("myUserId");
        socket.disconnect();
        window.location.href = "/";
    }

    return <>
        <div className="w-80 border-r h-full flex flex-col bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100">
                <h2 className="text-xl font-bold p-4">Chats</h2>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition cursor-pointer">
                    <FiLogOut size={18} />
                    Logout
                </button>
            </div>
            <div className="overflow-y-auto flex-1">

                {/* sidebar user card */}
                {users.map((user) => (
                    <div key={user._id}>
                        <SidebarCard selected={selectedUser?._id === user._id} path={user.avatar || "https://api.dicebear.com/9.x/adventurer/svg?seed=User"} alt={user.name} name={user.name} lastMessage={user?.lastMessage} onClick={() => { setSelectedUser(user); }} />
                    </div>
                ))}
            </div>

        </div>
    </>
}

export default Sidebar;