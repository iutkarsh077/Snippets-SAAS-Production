"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { SendReview } from "../../../actions/SendReview";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function ReviewUs() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        email,
        message,
      };
      setLoading(true);
      const res = await SendReview(data);
      if (res.status === false) {
        throw new Error(res.msg);
      }
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: formatDistanceToNow(new Date(new Date()), {
          addSuffix: true,
        }),
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center pt-20 text-center dark:text-white text-black overflow-hidden"
      >
        <CheckCircle className="w-24 h-24 text-green-400 mb-6" />
        <h2 className="text-4xl font-bold mb-4">Thank You!</h2>
        <p className="text-xl">Your review has been submitted successfully.</p>
      </motion.div>
    );
  }

  return (
    <div className="flex pt-20  justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-transparent hover:border-gray-300 ease-in-out duration-500"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold mb-6 text-center dark:text-white text-black"
        >
          Leave Us a Review
        </motion.h2>
        <form onSubmit={handleSendReview} className="space-y-6">
          <motion.div variants={itemVariants} className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-2 border-white border-opacity-50 rounded-lg p-7 dark:text-white text-black placeholder-transparent focus:border-opacity-100 transition-all"
              placeholder="Your Email"
            />
            <Label
              htmlFor="email"
              className="absolute left-4 -top-2.5 text-white text-sm transition-all bg-purple-700 px-2 rounded"
            >
              Your Email
            </Label>
          </motion.div>
          <motion.div variants={itemVariants} className="relative">
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-transparent border-2 border-white border-opacity-50 rounded-lg p-4 dark:text-white text-black placeholder-transparent focus:border-opacity-100 resize-none transition-all min-h-[120px]"
              placeholder="Your Review"
            />
            <Label
              htmlFor="message"
              className="absolute left-4 -top-2.5 text-white text-sm transition-all bg-purple-700 px-2 rounded"
            >
              Your Review
            </Label>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full dark:bg-white bg-black dark:text-purple-700 text-purple-400 hover:bg-opacity-90 transition-all py-4 rounded-lg text-lg font-semibold flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Review
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
