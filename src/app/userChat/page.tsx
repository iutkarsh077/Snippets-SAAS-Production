"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GetUserChat } from "../../../actions/GetUserChat";
import ChatCard from "./_components/ChatCard";
import { AnimatePresence } from "framer-motion";
import { Loader2, MessageCircleOff } from "lucide-react";

interface ChatTypes {
  id: string;
  text: string;
  sender: {
    username: string;
    profileImage: string;
  };
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserChat = () => {
  const [userChat, setUserChat] = useState<ChatTypes[] | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const getUserChat = async () => {
      try {
        setLoading(true);
        const res = await GetUserChat();
        if (res.status === false) {
          throw new Error(res.msg);
        }

        // Map data to match `ChatTypes` interface structure
        const chatData: ChatTypes[] =
          res.getUserChat?.map((chat: any) => ({
            id: chat.id,
            text: chat.text,
            sender: {
              username: chat.sender.username,
              profileImage: chat.sender.profileImage,
            },
            receiverId: chat.receiverId,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
          })) || [];

        setUserChat(chatData);
      } catch (error: any) {
        // console.log(error);
        toast({
          description: error.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    };
    getUserChat();
  }, [loadingDelete]);


  if(loading){
    return <div className="w-screen pt-44 overflow-hidden flex justify-center items-center">
      <Loader2 className="animate-spin w-7 h-7"/>
    </div>
  }

  return (
    <div className="mt-16 xl:pl-20  ml-2 pr-3 xl:pr-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {userChat && userChat.length > 0 ? (
        userChat
          ?.sort((a: { createdAt: any }, b: { createdAt: any }) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((chat) => (
            <ChatCard
              key={chat.id}
              id={chat.id}
              text={chat.text}
              username={chat.sender.username}
              createdAt={chat.createdAt}
              profileImage={chat.sender.profileImage}
              setLoadingDelete={setLoadingDelete}
            />
          ))
      ) : (
        <div className="flex justify-center items-center text-3xl font-bold bg-opacity-30 opacity-60 gap-x-3">
          No Messages <MessageCircleOff />
        </div>
      )}
    </div>
  );
};

export default UserChat;
