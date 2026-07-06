import { useEffect, useState } from "react";
import SidebarCard from "./SidebarCard";
import axios from "axios";

function Sidebar({ selectedUser, setSelectedUser, messages }) {
    //get users from /user/all and token from localStorage
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getUsers() {

            try {
                const response = await axios.get("http://localhost:4000/user/all", {
                    headers: {
                        token: localStorage.getItem("token")
                    }
                });
                setUsers(response.data.users);

            } catch (err) {
                console.log("Error when fetching the users");
            }

        }
        getUsers();
    }, []);
    return <>
        <div className="w-80 border-r h-full flex flex-col bg-white">
            <h2 className="text-xl font-bold p-4">Chats</h2>

            <div className="overflow-y-auto flex-1">

                {/* sidebar user card */}
                {users.map((user) => (
                    <div key={user._id}>
                        <SidebarCard selected={selectedUser?._id === user._id} path={user.avatar} alt={user.name} name={user.name} lastMessage={messages} onClick={() => { setSelectedUser(user); console.log("selected user = ", user.name, user._id); }} />
                    </div>
                ))}
            </div>

        </div>
    </>
}

export default Sidebar;