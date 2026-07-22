function SidebarCard({ path, alt, name, onClick, selected, lastMessage }) {
    return <>
        <div onClick={onClick} className={`flex items-center gap-4 p-5 hover:bg-gray-100 cursor-pointer rounded-xl ${selected ? "bg-orange-100 border-l-4 border-orange-500" : "hover:bg-gray-100"}`}>
            {/* img */}
            <img src={path} alt={alt} className="w-10 h-10 rounded-full object-cover" />

            {/* Right side */}
            <div className="flex-1 min-w-0">

                {/* Top Row */}
                <div className="flex justify-between items-center">
                    {/* Name */}
                    <h2 className="font-semibold text-base truncate">{name}</h2>
                    {/* User last message time */}
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                        {lastMessage?.createdAt &&
                            new Date(
                                lastMessage.createdAt
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                    </p>
                </div>

                {/* Last Message */}
                {/* lastMessage is Array of objects type so we use .map function */}
                {/* Get the last message using `messages.length - 1` (arrays are zero-indexed). */}
                {
                    <p className="text-sm text-gray-500 truncate mt-1">
                        {lastMessage?.content || "Start chatting..."}
                    </p>
                }
            </div>
        </div>
    </>
}

export default SidebarCard;