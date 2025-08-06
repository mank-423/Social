import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore"
import MessageSkeleton from "../Skeleton/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../../store/useAuthStore";
import avatar from "../../assets/avatar.png"
import { formatMessageTime } from "../../utils/lib";

const ChatContainer = () => {

    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeToMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser?._id);
            subscribeToMessages();
        }

        return () => unsubscribeToMessages();
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeToMessages])

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [getMessages])

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

            <div className="flex-1 overflow-y-auto p-4 spae-y-4 overflow-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        ref={messageEndRef}
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
                            {message.text && <p>{message.text}</p>}
                        </div>

                    </div>
                ))}
            </div>

            <MessageInput />

        </div>
    )
}

export default ChatContainer