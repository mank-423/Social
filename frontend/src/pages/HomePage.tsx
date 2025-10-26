import { useChatStore } from "../store/useChatStore"
import NoChatSelected from "../components/Chat/NoChatSelected";
import ChatContainer from "../components/Chat/ChatContainer";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect } from "react";
import { isServerReachable } from "../utils/network";

const HomePage = () => {

  const { selectedUser, processQueueMsg } = useChatStore();

  useEffect(() => {
    const checkAndProcessQueue = async () => {
      const isOnline = await isServerReachable();
      if (isOnline) {
        processQueueMsg();
      }
    };

    checkAndProcessQueue();

    // Use both browser event AND our smart check
    const handleOnline = () => {
      setTimeout(checkAndProcessQueue, 1000);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);


  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage