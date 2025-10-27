import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore"
import MessageSkeleton from "../Skeleton/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../../store/useAuthStore";
import avatar from "../../assets/avatar.png"
import { formatMessageTime } from "../../utils/lib";
import TypingIndicator from "./TypingIndicator";
import { ArrowUp, CheckCheck, Loader2 } from "lucide-react";

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeToMessages,
        retryMessages,
        loadMoreMessages,
        hasMoreMessages,
        isLoadingMoreMessages
    } = useChatStore();

    const { authUser } = useAuthStore();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Load messages and subscribe
    useEffect(() => {
        if (selectedUser?._id) {
            setIsInitialLoad(true);
            getMessages(selectedUser?._id);
            subscribeToMessages();
        }

        return () => unsubscribeToMessages();
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeToMessages])

    // Scroll to bottom on initial load
    useEffect(() => {
        if (messageEndRef.current && messages.length > 0 && isInitialLoad) {
            messageEndRef.current.scrollIntoView({ behavior: "auto" });
            setIsInitialLoad(false);
        }
    }, [messages, isInitialLoad]);

    const handleLoadMore = async () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Capture current scroll position and total height before loading
        const oldScrollHeight = container.scrollHeight;
        const oldScrollTop = container.scrollTop;

        // Load older messages
        await loadMoreMessages();

        // Wait for DOM to update with new messages
        requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;

            // Preserve the visible position (so the same messages stay in view)
            container.scrollTop = newScrollHeight - oldScrollHeight + oldScrollTop;
        });
    };


    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col">
            <ChatHeader />

            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {/* Load More Messages Button */}
                {hasMoreMessages && (
                    <div className="flex justify-center py-2">
                        {isLoadingMoreMessages ? (
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <Loader2 className="size-4 animate-spin" />
                                Loading more messages...
                            </div>
                        ) : (
                            <button
                                onClick={handleLoadMore}
                                className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-gray-50 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium transition-colors duration-200"
                            >
                                <ArrowUp className="size-4" />
                                More messages
                            </button>
                        )}
                    </div>
                )}

                {/* Messages */}
                {messages.map((message, index) => (
                    <div
                        key={message._id || message.tempId || index}
                        className={`chat ${message?.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={message.senderId === authUser?._id ? authUser.profilePic || avatar : selectedUser?.profilePic || avatar}
                                    alt="profile pic"
                                />
                            </div>
                        </div>

                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>

                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}

                            <div className="flex flex-row gap-2">
                                {message.text && <p>{message.text}</p>}

                                <div className="flex justify-end items-center gap-1 mt-1">
                                    {message.status === 'sending' && (
                                        <Loader2 className="size-4 animate-spin text-zinc-400" />
                                    )}
                                    {message.status === 'failed' && (
                                        <button
                                            onClick={() => retryMessages(message)}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            Retry
                                        </button>
                                    )}
                                    {message.status === 'sent' && (
                                        <CheckCheck className="size-4 font-bold text-green-400" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Scroll anchor for new messages */}
                <div ref={messageEndRef} />
            </div>

            <TypingIndicator />
            <MessageInput />
        </div>
    )
}

export default ChatContainer