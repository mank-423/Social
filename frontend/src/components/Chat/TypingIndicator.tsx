// import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const TypingIndicator = () => {
    const { typingUsers, selectedUser } = useChatStore();
    // const { authUser } = useAuthStore();

    // Show indicator only if the selected user is typing
    const isSelectedUserTyping = selectedUser && typingUsers.includes(selectedUser._id);

    if (!isSelectedUserTyping) return null;

    return (
        <div className="flex items-center gap-2 px-4 py-2 text-zinc-400">
            <div className="flex gap-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" 
                     style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" 
                     style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" 
                     style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">typing...</span>
        </div>
    );
};

export default TypingIndicator;