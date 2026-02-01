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

// Stream Chat styles are required - we override these with the style tag below
import "stream-chat-react/dist/css/v2/index.css";

import ChatLoader from "../components/ChatLoader";
import { Info, ShieldCheck, Video, ChevronLeft } from "lucide-react";
import { Link } from "react-router";

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

  // Find the other member to display in the sidebar
  const otherMember = Object.values(channel.state.members).find(
    (m) => m.user.id !== authUser._id
  )?.user;

  return (
    <div className="h-[calc(100vh-64px)] bg-base-200/50 p-2 sm:p-4 lg:p-6 overflow-hidden font-sans relative">
      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 size-96 bg-primary blur-[100px] rounded-full"></div>
        <div className="absolute bottom-20 right-10 size-96 bg-secondary blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto flex shadow-2xl rounded-3xl overflow-hidden border border-white/10 bg-base-100/60 backdrop-blur-xl">
        <Chat client={chatClient} theme="str-chat__theme-light">
          <Channel channel={channel}>
            {/* MAIN FLEX WRAPPER 
              This div ensures the Chat Window and Sidebar share the full 100% width 
            */}
            <div className="flex flex-1 w-full h-full overflow-hidden">
              
              {/* CHAT WINDOW SECTION */}
              <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                <Window>
                  <div className="relative">
                    {/* Floating Video Action */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex gap-2">
                      <button 
                        onClick={handleVideoCall}
                        className="btn btn-circle btn-ghost btn-sm text-primary hover:bg-primary/10 transition-colors"
                        title="Start Video Call"
                      >
                        <Video className="size-5" />
                      </button>
                    </div>
                    <ChannelHeader />
                  </div>
                  
                  <MessageList />
                  
                  <div className="p-4 bg-base-100/50 backdrop-blur-md border-t border-base-content/5">
                    <MessageInput focus />
                  </div>
                </Window>
                <Thread />
              </div>

              {/* RIGHT SIDEBAR: CONVERSATION INFO */}
              <div className="hidden lg:flex w-80 bg-base-100/40 backdrop-blur-md flex-col p-6 border-l border-base-content/5 shrink-0 transition-all">
                <div className="space-y-8 h-full flex flex-col">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-4 flex items-center gap-2">
                      <Info className="size-4" />
                      Conversation Info
                    </h3>
                    <div className="flex flex-col items-center text-center p-6 bg-base-200/50 rounded-3xl border border-base-content/5">
                      <div className="avatar mb-4">
                        <div className="w-24 rounded-2xl ring-4 ring-primary/10">
                          <img src={otherMember?.image} alt={otherMember?.name} />
                        </div>
                      </div>
                      <p className="font-bold text-xl tracking-tight">{otherMember?.name}</p>
                      <div className="badge badge-primary badge-outline badge-sm mt-2 font-medium">
                        Language Partner
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-2">
                      <ShieldCheck className="size-4" />
                      Safety & Privacy
                    </h3>
                    <div className="text-xs text-base-content/70 leading-relaxed bg-primary/5 p-4 rounded-2xl border border-primary/10">
                      Streamify ensures your conversations remain private. Please follow our community guidelines to maintain a helpful learning environment.
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                     <Link to="/" className="btn btn-ghost btn-sm btn-block rounded-xl text-base-content/50">
                       <ChevronLeft className="size-4 mr-1" />
                       Back to Dashboard
                     </Link>
                     <button className="btn btn-outline btn-error btn-sm btn-block rounded-xl border-opacity-20 hover:border-opacity-100 transition-all">
                       Report User
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </Channel>
        </Chat>
      </div>

      {/* STREAM CHAT UI OVERRIDES 
        This is necessary to force the third-party library to respect our layout and theme.
      */}
      <style>{`
        /* Force high-level Stream components to take up 100% of the parent container */
        .str-chat {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
        }
        .str-chat-channel {
          width: 100% !important;
          height: 100% !important;
        }
        .str-chat__container {
          background: transparent !important;
          width: 100% !important;
        }
        .str-chat__main-panel {
          background: transparent !important;
          width: 100% !important;
          flex: 1 !important;
        }

        /* Styling Header */
        .str-chat__header-livestream {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
          padding: 1.25rem !important;
        }

        /* Styling Message Bubbles */
        .str-chat__message-list {
          background: transparent !important;
          padding: 1.5rem !important;
        }
        .str-chat__message-bubble {
          border-radius: 1.25rem !important;
          padding: 0.8rem 1.2rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
        }
        .str-chat__message-simple--me .str-chat__message-bubble {
          background: hsl(var(--p)) !important;
          color: hsl(var(--pc)) !important;
          border: none !important;
        }
        .str-chat__message-simple .str-chat__message-bubble {
          background: hsl(var(--b1)) !important;
          border: 1px solid rgba(0,0,0,0.05) !important;
        }

        /* Input Customization */
        .str-chat__input-flat {
          background: transparent !important;
          padding: 0 !important;
        }
        .str-chat__input-flat-wrapper {
          background: hsl(var(--b1)) !important;
          border: 1px solid rgba(0,0,0,0.08) !important;
          border-radius: 1.25rem !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
          transition: border-color 0.2s;
        }
        .str-chat__input-flat-wrapper:focus-within {
          border-color: hsl(var(--p) / 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
