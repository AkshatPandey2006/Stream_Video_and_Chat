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

// Keep the original Stream styles
import "stream-chat-react/dist/css/v2/index.css";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

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
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // Cleanup to prevent multiple connections
    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] flex flex-col bg-base-200/50">
      <Chat client={chatClient} theme="str-chat__theme-light">
        {/* We wrap the inner parts in a full-width container to fix the 'half-box' issue */}
        <div className="flex-1 flex w-full h-full overflow-hidden">
          <Channel channel={channel}>
            <div className="flex-1 flex flex-col min-w-0 bg-base-100 relative">
              <CallButton handleVideoCall={handleVideoCall} />
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </div>
          </Channel>
        </div>
      </Chat>

      {/* Subtle SaaS styling that won't break functionality */}
      <style>{`
        .str-chat {
          height: 100%;
          width: 100%;
        }
        /* Match your theme's primary color for sent messages */
        .str-chat__message-simple--me .str-chat__message-bubble {
          background-color: hsl(var(--p)) !important;
          color: hsl(var(--pc)) !important;
        }
        /* Rounded corners for a modern feel */
        .str-chat__message-bubble {
          border-radius: 18px !important;
        }
        /* Clean up the input area */
        .str-chat__input-flat {
          padding: 1rem !important;
          background-color: hsl(var(--b1)) !important;
        }
        .str-chat__input-flat-wrapper {
          border-radius: 12px !important;
          border-color: hsl(var(--bc) / 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
