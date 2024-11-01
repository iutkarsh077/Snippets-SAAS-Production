"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Check, Pencil } from "lucide-react";
import axios from "axios";
import { SetProfileImage } from "../../../../../actions/SetProfileImage";

export default function CustomDialogForProfileImage({
  isOpen,
  setIsOpen,
  setProfileImage
}: {
  isOpen: boolean;
  setIsOpen: any;
  setProfileImage: React.Dispatch<React.SetStateAction<string>>;
}) {
  //   const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      const getImageRes = await axios.post("/api/ImageUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(getImageRes.data.status === false){
        throw new Error(getImageRes.data.message);
      }

      const saveProfileImage = await SetProfileImage(getImageRes.data.imageUrl);
      setProfileImage(saveProfileImage.saveProfileImage!);
      setIsUploaded(true);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Pencil className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload an image</DialogTitle>
        </DialogHeader>
        <div
          className={`mt-4 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <AnimatePresence>
            {!isUploading && !isUploaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 text-center mb-2">
                  Drag and drop your image here, or click to select a file
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                >
                  Select File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </motion.div>
            )}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </motion.div>
            )}
            {isUploaded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <Check className="w-12 h-12 text-green-500 mb-4" />
                <p className="text-sm text-gray-600">Upload complete!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
