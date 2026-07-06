function SidebarCard({ path, alt, name, onClick, selected, lastMessage }) {
    return <>
        <div onClick={onClick} className={`flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer rounded-lg ${selected ? "bg-blue-100" : "hover:bg-gray-100"}`}>
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
                        {lastMessage?.length > 0 &&
                            new Date(
                                lastMessage[lastMessage.length - 1].createdAt
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                    </p>
                </div>

                {/* Last Message */}
                {/* lastMessage is Array of objects types so we use .map function */}
                {/* Here we need to display last msg, se get total lastMsg index and minus 1 for 0 array indexing */}
                {lastMessage?.length > 0 && (
                    <p className="text-sm text-gray-500 truncate mt-1">
                        {lastMessage?.length > 0
                            ? lastMessage[lastMessage.length - 1].content
                            : "Start chatting..."}
                    </p>
                )}
            </div>
        </div>
    </>
}

export default SidebarCard;