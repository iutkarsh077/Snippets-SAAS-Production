"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  MessageCircle,
  Bookmark,
  Ellipsis,
  ArrowBigUp,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { FeedLikesIncreaseorDecrease } from "../../../../actions/FeedLikesIncreaseOrDecrease";
import { GetLikesOfFeed } from "../../../../actions/GetLikesOfFeed";
import { CommentDialog } from "./Comment-Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SaveEditedFeed } from "../../../../actions/SaveEditedFeed";
import { useToast } from "@/hooks/use-toast";
import { GetUserDetails } from "../../../../actions/GetUserDetails";

export interface Author {
  id: string;
  name: string;
  username: string;
  profileUrl: string;
}
export interface ImageCardProps {
  id: string;
  content: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  author: Author;
  handleDeleteFeed: (feedId: string) => void;
}

const ImageCard: React.FC<any> = ({
  id,
  author,
  content,
  image,
  createdAt,
  handleDeleteFeed,
}) => {
  const [clickedReadMore, setClickedReadMore] = useState(false);
  const [likes, setLikes] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [editedFeedText, setEditedFeedText] = useState(content);
  const [openEditedFeedDialog, setEditedFeedDialog] = useState(false);
  const [feedDescription, setFeedDescription] = useState(content);
  const [openDeleteFeedDialog, setOpenDeleteFeedDialog] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikes = async (feedId: string) => {
      try {
        const res = await GetLikesOfFeed(feedId);

        if (res.status === false) {
          throw new Error(res.msg);
        }

        setLikes(res.data);
        setUserId(res.data?.userId);
        if (
          res.data?.getAllLikes.some(
            (like) => like.authorId === res.data.userId
          )
        ) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    fetchLikes(id);
  }, []);

  const handleLikeToggle = async (feedId: string) => {
    if (userId === null) {
      return;
    }
    try {
      const isCurrentlyLiked = liked;
      const newLikesCount = isCurrentlyLiked
        ? likes.likesCount - 1
        : likes.likesCount + 1;

      setLiked(!isCurrentlyLiked);
      setLikes((prevLikes: any) => ({
        ...prevLikes,
        likesCount: newLikesCount,
      }));

      const res = await FeedLikesIncreaseorDecrease(feedId);

      if (!res.status) {
        throw new Error(res.msg);
      }

      const updatedLikes = res?.data?.getAllLikes || [];
      const userHasLiked = updatedLikes.some(
        (like) => like.authorId === res?.data?.userId
      );

      setLikes(res.data);
      setLiked(userHasLiked);
    } catch (error) {
      // console.error("Error toggling like:", error);

      setLiked(!liked);
      setLikes((prevLikes: any) => ({
        ...prevLikes,
        likesCount: liked ? prevLikes.likesCount + 1 : prevLikes.likesCount - 1,
      }));
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(image);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      const fileName = image.split("/").pop() || "image";
      link.download = fileName.includes(".") ? fileName : `${fileName}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      setError(null);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image. Please try again.");
    }
  };

  const handleSaveEditedFeed = async () => {
    try {
      setLoadingDescription(true);
      const res = await SaveEditedFeed(editedFeedText, id);

      if (res.status === false) {
        throw new Error(res.msg);
      }

      toast({
        title: "Feed updated successfully",
        duration: 1000,
      });
      setEditedFeedDialog(false);
      setFeedDescription(editedFeedText);
    } catch (error) {
      // console.log(error);
      toast({
        title: "Failed to update Feed",
        duration: 1000,
      });
    } finally {
      setLoadingDescription(false);
    }
  };

  const copyToClipboard = () => {
    if (!window) return;
    const url = window.location.origin;
    navigator.clipboard.writeText(`${url}/feeds/${id}`);
    toast({
      title: "URL copied successfully",
      duration: 1000,
    });
  };

  return (
    <>
      <Card className="w-full max-w-lg overflow-hidden border-none">
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <Link
              href={`/profile/${author.username}`}
              className="flex gap-x-4 items-center"
            >
              <img
                src={author.profileImage}
                className="rounded-full inline w-12 h-12"
                alt={`${author.name}'s profile`}
              />
              <h2 className="text-sm font-semibold inline">
                {author.username}
              </h2>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="border-red-700">
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="hover:cursor-pointer">
                <DropdownMenuItem onClick={copyToClipboard}>
                  Share
                </DropdownMenuItem>
                {likes && likes?.userId == author.id && (
                  <>
                    <DropdownMenuItem onClick={() => setEditedFeedDialog(true)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => setOpenDeleteFeedDialog(true)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!image && (
            <>
              {!image && feedDescription && (
                <p className="text-sm font-semibold mb-1 px-5">
                  <span className="font-normal">
                    {clickedReadMore === true ? (
                      <Link href={`/feeds/${id}`}>{feedDescription}</Link>
                    ) : (
                      feedDescription.slice(0, 200)
                    )}
                    {feedDescription.length > 100 && (
                      <span
                        onClick={() => setClickedReadMore(!clickedReadMore)}
                        className="pl-2 text-gray-500 hover:cursor-pointer"
                      >
                        {clickedReadMore === true ? "Read Less" : "Read more"}
                      </span>
                    )}
                  </span>
                </p>
              )}
            </>
          )}
          <Link href={`/feeds/${id}`}>
            {image && (
              <div className="relative w-full h-[300px]">
                <Image src={image} alt={content} layout="fill" />
              </div>
            )}
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4">
          <div className="flex justify-between w-full mb-2">
            <div className="flex space-x-2 w-20">
              <div className="flex gap-x-2 w-[60%]">
                <ArrowBigUp
                  className={`w-6 h-6 cursor-pointer ${
                    liked
                      ? "text-red-500 scale-110"
                      : "dark:text-white text-black"
                  }`}
                  onClick={() => handleLikeToggle(id)}
                />
                {likes && <div>{likes.likesCount}</div>}
              </div>
              <MessageCircle
                onClick={() => setOpenCommentDialog(true)}
                className="h-6 w-[40%] cursor-pointer"
              />
              {/* <Send className="w-6 h-6 cursor-pointer" /> */}
            </div>
            <Bookmark
              className="w-6 h-6 cursor-pointer"
              onClick={handleDownload}
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          {image && feedDescription && (
            <p className="text-sm font-semibold mb-1">
              {author.name}{" "}
              <span className="font-normal">
                {clickedReadMore === true
                  ? feedDescription
                  : feedDescription.slice(0, 100)}
                {feedDescription.length > 100 && (
                  <span
                    onClick={() => setClickedReadMore(!clickedReadMore)}
                    className="pl-2 text-gray-500 hover:cursor-pointer"
                  >
                    {clickedReadMore === true ? "Read Less" : "Read more"}
                  </span>
                )}
              </span>
            </p>
          )}
          <p className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </p>
        </CardFooter>
      </Card>
      {openCommentDialog && (
        <div>
          <CommentDialog
            isOpen={openCommentDialog}
            onClose={() => setOpenCommentDialog(false)}
            feedId={id}
          />
        </div>
      )}
      {openEditedFeedDialog && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-30">
          <div className="bg-white dark:bg-black  rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-1">Edit Feed</h2>
            <h4 className="text-sm mb-4 text-gray-500">
              Make changes to your profile here. Click save when you&apos;re
              done.
            </h4>
            <Textarea
              className="w-full p-2 h-64 resize-none example border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedFeedText}
              onChange={(e) => setEditedFeedText(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300"
                onClick={() => setEditedFeedDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-gray-800 dark:text-white  rounded-lg"
                onClick={handleSaveEditedFeed}
              >
                {loadingDescription ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {openDeleteFeedDialog && (
        <div className="fixed inset-0 flex justify-center items-center  bg-black bg-opacity-25 z-30">
          <div className="dark:bg-black bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-1 text-black dark:text-white">
              Delete Feed
            </h2>
            <h4 className="text-sm mb-4 text-gray-500">
              Confirm that you are permanently deleting the feed.
            </h4>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300"
                onClick={() => setOpenDeleteFeedDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-black  rounded-lg"
                onClick={() => {
                  handleDeleteFeed(id), setOpenDeleteFeedDialog(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCard;
