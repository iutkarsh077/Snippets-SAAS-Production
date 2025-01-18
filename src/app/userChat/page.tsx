"use client";

import { pusherClient } from "@/lib/pusher/client/index";
import { useEffect, useRef, useState } from "react";
import { GetAllUser } from "../../../actions/GetAllUsers";
import { GetUserDetails } from "../../../actions/GetUserDetails";
import { GetChat } from "../../../actions/GetChat";
import { AlignJustify, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

const generateRoomId = (user1Id: string, user2Id: string) =>
  [user1Id, user2Id].sort().join("-");

export default function MessageList() {
  const [currentUserId, setCurrentUserId] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [userList, setUserList] = useState<any>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [roomId, setRoomId] = useState("room1");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showUserList, setShowUserList] = useState(true);

  useEffect(() => {
    if (!selectedUserId) return;
    const getUserChat = async () => {
      try {
        const res = await GetChat(selectedUserId);
        if (res.status === false) {
          throw new Error(res.msg);
        }
        // console.log(res);
        setMessages(res.chat);
      } catch (error) {
        // console.log(error);
      }
    };
    getUserChat();
  }, [selectedUserId]);

  useEffect(() => {
    if (!roomId) {
      // console.log("No room id");
      return;
    }
    const channel = pusherClient.subscribe(roomId).bind("chat", (data: any) => {
      // console.log("Data is: ", data);
      setMessages((prevMessages: any) => [...prevMessages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [selectedUserId]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const currentUser = await GetUserDetails();
        const res = await GetAllUser();
        // console.log(res);
        setUserList(res?.data);
        setCurrentUserId(currentUser?.decodeCookieValue?.id);
      } catch (error) {
        // console.log(error);
      }
    };
    getAllUsers();
  }, []);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      // Prevent the default behavior (e.g., form submission if inside a form)
      event.preventDefault();

      // Submit or send the message
      handleTestClick();
    }
  };
  const handleTestClick = async () => {
    // console.log(roomId);
    const data = await fetch("/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputMsg,
        roomId,
        receiver: selectedUserId,
        senderId: currentUserId,
      }),
    });
    setInputMsg("");
    const json = await data.json();
    // console.log(json);
  };

  const handleUserSelection = (selectedUserId: string) => {
    // Replace with the actual logged-in user's ID
    const newRoomId = generateRoomId(currentUserId, selectedUserId);
    setRoomId(newRoomId);
    setSelectedUserId(selectedUserId);
    setMessages([]);
  };

  // console.log(messages);
  // console.log(selectedUserId)
  return (
    <div className="md:px-40 mt-16">
      {userList && messages && (
        <div className="flex h-screen">
          {/* Left Side - User List */}
          {showUserList && (
            <div className="w-full   p-4 overflow-y-auto h-full">
              <div className="flex justify-between items-center px-6">
                <h2 className="text-2xl font-bold">Friends</h2>
                <X
                  onClick={() => setShowUserList(false)}
                  className="cursor-pointer transition"
                />
              </div>
              <div className="mt-4 flex flex-col gap-4">
                {userList.map((user: any) => (
                  <div
                    key={user.friend.id}
                    className="flex gap-x-4 border dark:border-white border-gray-300 rounded-lg shadow-sm items-center hover:scale-95 transition p-4 hover:cursor-pointer"
                    onClick={() => {
                      handleUserSelection(user.friend.id),
                        setShowUserList(false);
                    }}
                  >
                    <p>
                      {" "}
                      {user.friend.profileImage ? (
                        <Image
                          src={user.friend.profileImage}
                          alt={user.friend.username} // Provide alt text for accessibility
                          width={100}
                          height={100}
                          className="rounded-full w-10 h-10" // Ensure the image is centered and covers the circle
                        />
                      ) : (
                        <div className="rounded-full bg-black w-10 h-10 flex items-center justify-center text-white font-semibold text-lg">
                          {user.friend.username[0].toUpperCase()}
                        </div>
                      )}
                    </p>
                    <h3 className="text-lg font-medium text-black dark:text-white">
                      {user.friend.username}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Side - Chat */}
          <div
            className={`flex-1 flex flex-col ${
              showUserList === true ? "hidden" : ""
            }`}
          >
            <div className="flex items-center gap-4 p-4">
              <AlignJustify
                onClick={() => setShowUserList(true)}
                className=" cursor-pointer transition"
              />
              <h2 className="text-2xl font-bold">Chat</h2>
            </div>
            <div
              className={`${
                showUserList ? "hidden" : "flex flex-col gap-4 mt-4 p-4"
              } overflow-y-auto pt-2 example`}
              style={{ paddingBottom: "4rem" }} // Adds padding to ensure the last message is visible
            >
              {selectedUserId ? (
                messages.map((message: any, index: number) => (
                  <div
                    key={index}
                    className={`flex justify-between  border dark:border-black border-gray-300  font-medium dark:text-white text-black rounded-lg p-3 shadow-sm ${
                      message.senderId === currentUserId ? "bg-blue-100" : ""
                    }`}
                    ref={lastMessageRef}
                  >
                    <p
                      className={`text-sm w-[70%] text-black ${
                        message.senderId === currentUserId
                          ? "dark:text-black text-black"
                          : "dark:text-white text-black"
                      }`}
                    >
                      {message.text}
                    </p>
                    <p
                      className={`text-xs  md:text-sm font-normal text-black ${
                        message.senderId === currentUserId
                          ? "dark:text-black text-black"
                          : "dark:text-white text-black"
                      }`}
                    >
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <span className="text-gray-400 text-lg sm:text-2xl">
                    No Friends Selected
                  </span>
                </div>
              )}
            </div>

            {/* Input for Sending Messages */}
            <div className="w-full fixed bottom-4 flex px-4  gap-3 shadow-md">
              <input
                type="text"
                value={inputMsg}
                className="w-[80%] md:w-[70%]  border  rounded-lg p-3 text-sm  focus:outline-none shadow-sm"
                placeholder="Enter your message"
                onKeyDown={handleKeyPress}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-400 transition shadow-sm"
                onClick={() => handleTestClick()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
