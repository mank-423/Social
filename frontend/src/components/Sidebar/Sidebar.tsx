import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import SidebarSkeleton from "../Skeleton/SidebarSkeleton";
import avatar from "../../assets/avatar.png"
import { useAuthStore } from "../../store/useAuthStore";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Users } from "lucide-react";

const Sidebar = () => {
    const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    // Fetch initial users
    useEffect(() => {
        const fetchInitialUsers = async () => {
            const res = await getUsers(1);
            if (res?.data.data.length < 10) setHasMore(false);
        };
        fetchInitialUsers();
    }, []);

    // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Fetch more users function for InfiniteScroll
    const fetchMoreUsers = async () => {
        const nextPage = page + 1;
        try {
            // await delay(1000);
            const res = await getUsers(nextPage);
            
            if (res?.data.data.length < 10) {
                setHasMore(false);
            }
            setPage(nextPage);
        } catch (error) {
            console.log('Error fetching more users:', error);
        }
    };

    const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users;

    if (isUsersLoading && users.length === 0) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border- border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                {/* To do online filter */}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div>
            </div>

            {/* Infinite Scroll Container */}
            <div 
                id="sidebar-scroll-container"
                className="overflow-y-auto w-full py-3"
                style={{ maxHeight: "calc(100vh - 100px)" }}
            >
                <InfiniteScroll
                    dataLength={users.length}
                    next={fetchMoreUsers}
                    hasMore={hasMore}
                    loader={
                        <div className="text-center py-4">
                            <div className="animate-pulse flex items-center justify-center gap-2">
                                <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
                                <span className="flex flex-row text-sm">
                                    Loading users..
                                </span>
                            </div>
                        </div>
                    }
                    endMessage={
                        filteredUsers.length > 0 && (
                            <div className="text-center py-4 text-sm text-zinc-500">
                                {/* No more users to load */}
                            </div>
                        )
                    }
                    scrollableTarget="sidebar-scroll-container"
                    style={{ overflow: 'visible' }}
                >
                    {/* Wrap children in a fragment */}
                    <>
                        {filteredUsers.map((user) => (
                            <button
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`
                                    w-full p-3 flex items-center gap-3
                                    hover:bg-base-300 transition-colors
                                    ${selectedUser?._id === user._id
                                        ? "bg-base-300 ring-1 ring-base-300"
                                        : ""
                                    }
                                `}
                            >
                                <div className="relative mx-auto lg:mx-0">
                                    <img
                                        src={user.profilePic || avatar}
                                        alt={user.fullName}
                                        className="size-12 object-cover rounded-full"
                                    />
                                    {onlineUsers.includes(user._id) && (
                                        <span
                                            className="absolute bottom-2 right-0 size-3 bg-green-500 
                                            rounded-full ring-2 ring-zinc-900"
                                        />
                                    )}
                                </div>

                                <div className="hidden lg:block text-left min-w-0">
                                    <div className="font-medium truncate">{user.fullName}</div>
                                    <div className="text-sm text-zinc-400">
                                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                    </div>
                                </div>
                            </button>
                        ))}

                        {filteredUsers.length === 0 && !isUsersLoading && (
                            <div className="text-center text-zinc-500 py-4">
                                {showOnlineOnly ? "No online users" : "No users found"}
                            </div>
                        )}
                    </>
                </InfiniteScroll>
            </div>
        </aside>
    );
};

export default Sidebar;