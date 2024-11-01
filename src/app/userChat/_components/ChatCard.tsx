"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteMessage } from "../../../../actions/DeleteMessage";
import { useToast } from "@/hooks/use-toast";

export default function ChatCard({
  id,
  text,
  username,
  createdAt,
  profileImage,
  setLoadingDelete,
}: {
  id: string;
  text: string;
  username: string;
  createdAt: Date;
  profileImage: string;
  setLoadingDelete: any;
}) {
  const [isDialogOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteMsg = async (id: string) => {
    setLoadingDelete(true);
    try {
      const res = await DeleteMessage(id);
      if (res.status === false) {
        throw new Error(res.msg);
      }

      setIsOpen(false);
      setLoadingDelete(false);
      toast({
        title: res.msg,
        description: formatDistanceToNow(new Date()),
      });
    } catch (error: any) {
    //   console.log(error);
      toast({
        title: "Something went wrong, Please try again after somethime",
        description: formatDistanceToNow(new Date()),
      });
      setIsOpen(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-md hover:cursor-pointer w-full mx-auto hover:shadow-xl transition-shadow duration-300 ease-in-out outline-none hover:outline hover:outline-black hover:outline-2">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {profileImage.length > 0 ? (
                <Image
                  alt="img"
                  src={profileImage}
                  width={100}
                  height={100}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <User className="text-primary-foreground" />
              )}
            </motion.div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {username}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div>
            <X
              onClick={() => setIsOpen(true)}
              className="w-6 h-6 bg-red-800 rounded-sm hover:scale-110"
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">{text}</p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <motion.div
            className="w-full text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* You can add additional footer content here if needed */}
            {/* For example: <span>Seen</span> */}
          </motion.div>
        </CardFooter>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md rounded-lg p-6 shadow-lg transition-all duration-300">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription className="mt-4 text-sm text-gray-600 dark:text-white">
              This action cannot be undone. This will permanently delete your
              data.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:text-black hover:bg-gray-200 transition-all duration-200"
            >
              Back
            </Button>
            <Button
              onClick={() => handleDeleteMsg(id)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white dark:text-black hover:bg-red-700 transition-all duration-200"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
