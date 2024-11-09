"use client";
import { FileUpload } from "@/components/ui/file-upload";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const UploadImageAndShareLink = () => {
  const [files, setFiles] = useState<File | any>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>("");
  const { toast } = useToast();

  const handleFileChange = (files: File) => {
    setFiles(files);
    // console.log(files);
  };

  const handleUploadFile = async () => {
    if (files?.size === 0) {
      toast({
        title: "Empty File or File size is Zero.",
        duration: 2000,
        description: formatDistanceToNow(new Date(new Date()), {
          addSuffix: true,
        }),
      });
      return;
    }
    setLoadingUpload(true);
    try {
      const formData = new FormData();
      formData.append("file", files);
      const getImageRes = await axios.post("/api/ImageUploadForLink", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (getImageRes.data.status === false) {
        throw new Error(getImageRes.data.message);
      }

    //   console.log(getImageRes);
      setUploadedImageUrl(getImageRes.data.imageUrl);
    } catch (error) {
      toast({
        title: "Uploading File failed",
        description: formatDistanceToNow(new Date(new Date()), {
          addSuffix: true,
        }),
      });
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleCopyImage = () => {
    navigator.clipboard.writeText(uploadedImageUrl!);
    toast({
      title: "Link Copied Successfully",
      duration: 2000,
      description: formatDistanceToNow(new Date(new Date()), {
        addSuffix: true,
      }),
    });
  };

  if (loadingUpload) {
    return (
      <div className="flex justify-center mt-40">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-full max-w-4xl mx-auto min-h-96  rounded-lg">
      {!uploadedImageUrl ? (
        <>
          <FileUpload onChange={handleFileChange} />
          <Button onClick={handleUploadFile}>Upload</Button>
        </>
      ) : (
        <div className=" w-full h-full flex flex-col gap-y-4 pt-20 justify-center items-center">
          <Image
            src={uploadedImageUrl}
            width={1000}
            height={1000}
            className="object-contain w-full h-auto max-h-96 rounded-md"
            alt="lkjk"
          />
          <Button onClick={handleCopyImage}>Copy</Button>
        </div>
      )}
    </div>
  );
};

export default UploadImageAndShareLink;
