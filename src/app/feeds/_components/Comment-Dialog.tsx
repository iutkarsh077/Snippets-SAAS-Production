import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comment } from "./Comment";
import { SaveCommentForFeed } from "../../../../actions/saveCommentsforFeed";
import { useToast } from "@/hooks/use-toast";
import { GetFeedComment } from "../../../../actions/GetFeedComment";
import { AArrowDown, Delete, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GetUserDetails } from "../../../../actions/GetUserDetails";
import { DeleteFeedComment } from "../../../../actions/DeleteFeedComment";
import { text } from "body-parser";

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feedId: string;
}

export function CommentDialog({ isOpen, onClose, feedId }: CommentDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saveNewCommentLoading, setSaveNewCommentLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInputReadOnly, setIsInputReadOnly] = useState(true);

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        setLoading(true);
        const res = await GetFeedComment(feedId);
        if (res.status === false) {
          throw new Error(res.msg);
        }

        const res2 = await GetUserDetails();
        if (res2.status === false) {
          throw new Error(res2.msg);
        }
        setComments(res.commentsData);
        setUserId(res2.decodeCookieValue?.id);
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllComments();
  }, []);

  const handleAddComment = async () => {
    if (newComment.length <= 0) {
      toast({
        title: "Comment box is empty",
        duration: 1000,
      });
    }
    try {
      setSaveNewCommentLoading(true);
      const data = {
        feedId,
        text: newComment.trim(),
      };
      const res = await SaveCommentForFeed(data);
      if (res.status === false) {
        throw new Error(res.msg);
      }
      setComments((prevComments: any) => {
        const updatedComments = [...prevComments];
        updatedComments.unshift(res.commentData);
        return updatedComments;
      });
      toast({
        title: res.msg,
        duration: 1000,
      });
    } catch (error) {
      // console.log(error);
    } finally {
      setNewComment("");
      setSaveNewCommentLoading(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    // console.log(id);
    try {
      setComments(comments.filter((comment: any) => comment.id !== id));
      const res = await DeleteFeedComment(id);
      if (res.status === false) {
        throw new Error(res.msg);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogClose asChild></DialogClose>
        </DialogHeader>
        {comments === null ? (
          <div className="flex justify-center items-center h-[300px]">
            {loading === true ? (<Loader2 className="w-7 h-7 animate-spin" />) : (<div className="text-neutral-600">Please Login to see the comments.</div>)}
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            {comments.length <= 0 ? (
              <div className="flex h-[300px] text-3xl dark:text-neutral-600 text-neutral-300 justify-center items-center">
                No Comments
              </div>
            ) : (
              <div className="space-y-6">
                {comments?.map((comment: any) => (
                  <Comment
                    {...comment}
                    key={comment.id}
                    onDelete={() => handleDeleteComment(comment.id)}
                    userId={userId}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        )}
        {userId && (
          <div className="flex items-center space-x-2 mt-4">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow"
              tabIndex={-1}
              onClick={() => setIsInputReadOnly(false)}
              readOnly={isInputReadOnly}
            />
            <Button onClick={handleAddComment}>
              {saveNewCommentLoading ? (
                <Loader2 className="w-4 h-4 dark:text-black text-white animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
