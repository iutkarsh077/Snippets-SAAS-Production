"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { CircleX, Loader2, Send } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { SaveFeedPost } from "../../../../actions/saveFeedPost";

const UploadFeeds = () => {
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<any>(null);
  const [text, setText] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [postUploadLoading, setPostUploadLoading] = useState(false);

  const handleImageChange = (files: File) => {
    setImageToUpload(files);

    if (files) {
      const reader = new FileReader();

      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(files);
    }
  };

  const handleRemove = () => {
    setImageSrc("");
    setImageToUpload(null);
  };

  useEffect(() => {
    const handleUploadImage = async () => {
      setLoading(true);
      try {
        if (!imageToUpload || imageToUpload?.size === 0) {
          return;
        }
        const formData = new FormData();
        formData.append("file", imageToUpload);
        const getImageRes = await axios.post(
          "/api/ImageUploadForLink",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (getImageRes.data.status === false) {
          throw new Error(getImageRes.data.message);
        }

        // console.log(getImageRes.data.imageUrl);
        setUploadedImageUrl(getImageRes.data.imageUrl);
      } catch (error) {
        // console.log(error);
      }finally{
        setLoading(false);
      }
    };
    handleUploadImage();
  }, [imageToUpload]);

  const handleSubmitPost = async () => {
    try {
      setPostUploadLoading(true);
      if (text.length === 0 && !uploadedImageUrl) {
        toast({
          title: "😅 Oops! Nothing to Post",
          description:
            "It looks like your post is empty. Add some content or an image to get started! 🚀",
          duration: 1000,
        });
        return;
      }
      const postData = {
        text,
        uploadedImageUrl,
      };

      const res = await SaveFeedPost(postData);
      if(res.status === false){
        throw new Error(res.msg)
      }
      toast({
        title: "🎉 Good to Go! 🚀",
        description: "Your feed has been uploaded successfully! Keep it up! 💪",
        duration: 1000,
      });
      setText("");
      setUploadedImageUrl("");
      setImageSrc("");
      setImageToUpload(null);
    } catch (error) {
      toast({
        title: "Oops, Failed Post",
        description: "Internal Server error, Please try again after some time!",
        duration: 1000,
      });
    }
    finally{
      setPostUploadLoading(false);
    }
  };

  if(postUploadLoading){
    return (
      <div className="flex justify-center items-center pt-60">
        <Loader2 className="animate-spin h-16 lg:h-28 w-auto"/>
      </div>
    )
  }



  return (
    <div className={`w-full flex justify-center`}>
      <div className="w-[75%]  py-6 px-5 ">
        <h1 className="text-4xl font-semibold flex justify-center">
          Share your feed
        </h1>
        <div className="pt-8 space-y-10 flex flex-col items-center">
          <div className="w-full lg:w-[50%]  flex justify-end">
            <Textarea
              className="w-full h-20 resize-y focus-visible:ring-transparent border-none example"
              placeholder="Share your Thoughts here!"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          </div>
          <div>
            {imageSrc ? (
              <div className="w-full relative">
                <Image
                  src={imageSrc}
                  alt="Selected Preview"
                  className="h-[300px] w-full object-cover"
                  width={300}
                  height={300}
                />
                <CircleX
                  onClick={handleRemove}
                  className=" absolute top-2 right-2 text-red-500 cursor-pointer"
                />
              </div>
            ) : (
              <div className="w-full">
                <FileUpload onChange={handleImageChange} />
              </div>
            )}
          </div>
          <Button className={`px-5 flex gap-x-4 ${loading ? "bg-gray-400" : ""}`} disabled={loading} onClick={handleSubmitPost}>
            <Send />
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadFeeds;
