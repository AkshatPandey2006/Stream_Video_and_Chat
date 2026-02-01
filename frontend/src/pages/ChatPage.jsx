import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

// Stream Chat styles are required - we will override with Tailwind
import "stream-chat-react/dist/css/v2/index.css";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import { Info, ShieldCheck, Video } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Connection lost. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `🚀 I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Call link shared in chat!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[calc(100vh-64px)] bg-base-200/50 p-2 sm:p-4 lg:p-6 overflow-hidden font-sans">
      {/* Background Blurs to match branding */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 size-96 bg-primary blur-[100px] rounded-full"></div>
        <div className="absolute bottom-20 right-10 size-96 bg-secondary blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto flex shadow-2xl rounded-3xl overflow-hidden border border-white/10 bg-base-100/60 backdrop-blur-xl">
        <Chat client={chatClient} theme="str-chat__theme-light">
          <Channel channel={channel}>
            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col min-w-0 bg-transparent border-r border-base-content/5">
              <Window>
                {/* Custom Styled Header Wrapper */}
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex gap-2">
                    <button 
                      onClick={handleVideoCall}
                      className="btn btn-circle btn-ghost btn-sm text-primary hover:bg-primary/10"
                    >
                      <Video className="size-5" />
                    </button>
                  </div>
                  <ChannelHeader />
                </div>
                
                <MessageList />
                
                {/* Refined Message Input Wrapper */}
                <div className="p-4 bg-base-100/50 backdrop-blur-md border-t border-base-content/5">
                  <MessageInput focus />
                </div>
              </Window>
              <Thread />
            </div>

            {/* RIGHT SIDEBAR: CHAT INFO (SaaS pattern) */}
            <div className="hidden lg:flex w-80 bg-base-100/40 backdrop-blur-md flex-col p-6 border-l border-base-content/5">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4 flex items-center gap-2">
                    <Info className="size-4" />
                    Conversation Info
                  </h3>
                  <div className="flex flex-col items-center text-center p-4 bg-base-200/50 rounded-2xl border border-base-content/5">
                    <div className="avatar mb-3">
                      <div className="w-20 rounded-2xl ring-4 ring-primary/10">
                        <img src={Object.values(channel.state.members).find(m => m.user.id !== authUser._id)?.user.image} />
                      </div>
                    </div>
                    <p className="font-bold text-lg">
                      {Object.values(channel.state.members).find(m => m.user.id !== authUser._id)?.user.name}
                    </p>
                    <div className="badge badge-primary badge-outline badge-sm mt-1">Language Partner</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-2">
                    <ShieldCheck className="size-4" />
                    Safety & Privacy
                  </h3>
                  <div className="text-xs text-base-content/60 leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/10">
                    Your conversations are encrypted. Always be respectful to your language partners.
                  </div>
                </div>

                <div className="mt-auto">
                   <button className="btn btn-outline btn-block btn-sm rounded-xl opacity-50 hover:opacity-100">
                     Report User
                   </button>
                </div>
              </div>
            </div>
          </Channel>
        </Chat>
      </div>

      {/* Global CSS Overrides for Stream Chat to match SaaS theme */}
      <style>{`
        .str-chat__container {
          background: transparent !important;
        }
        .str-chat__main-panel {
          background: transparent !important;
        }
        .str-chat__header-livestream {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
          padding: 1rem !important;
        }
        .str-chat__message-list {
          background: transparent !important;
        }
        .str-chat__message-bubble {
          border-radius: 1.25rem !important;
          padding: 0.75rem 1rem !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
        }
        .str-chat__message-simple--me .str-chat__message-bubble {
          background: hsl(var(--p)) !important;
          color: hsl(var(--pc)) !important;
        }
        .str-chat__input-flat {
          background: transparent !important;
          border: none !important;
        }
        .str-chat__input-flat-wrapper {
          background: hsl(var(--b1)) !important;
          border: 1px solid rgba(0,0,0,0.1) !important;
          border-radius: 1rem !important;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
