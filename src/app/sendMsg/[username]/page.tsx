"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import React from "react";
import { SaveAndSendMessage } from "../../../../actions/SaveAndSendMessage";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const SendMsgToAnotherUser = () => {
  const { username } = useParams();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    if (question.length === 0) return;
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        receiverUsername: username,
        text: question,
      };
      const res = await SaveAndSendMessage(data as any);

      if (res.status === false) {
        throw new Error(res.msg);
      }
      toast({
        title: "Scheduled: Catch up",
        description: formatDistanceToNow(new Date(new Date()), {
          addSuffix: true,
        }),
      });
      setQuestion("");
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-6 bg-background rounded-lg"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-lg font-medium mb-4 text-foreground"
      >
        Send a message to <span className="font-semibold">{username}</span>
      </motion.h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div whileTap={{ scale: 0.995 }}>
          <textarea
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            placeholder="Type your message here..."
            className="w-full h-32 p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 ease-in-out resize-none example bg-background text-foreground placeholder-muted-foreground"
            aria-label="Question input"
          />
        </motion.div>
        <div className="flex justify-between items-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            {question.length} characters
          </motion.p>
          {
            loading ? (<Loader2 className="animate-spin"/>) : (<motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 hover:cursor-pointer bg-primary text-primary-foreground rounded-md flex items-center space-x-2 hover:bg-primary/90 transition-colors duration-200"
              disabled={question.length === 0}
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </motion.button>)
          }
          
        </div>
      </form>
    </motion.div>
  );
};

export default SendMsgToAnotherUser;
