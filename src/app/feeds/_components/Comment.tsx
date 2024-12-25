import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleX } from "lucide-react";
import Link from "next/link";

interface AuthorProp {
  id: string;
  username: string;
  profileImage: string;
}

interface feedAuthor {
  authorId: string;
}

interface CommentProps {
  content: string;
  author: AuthorProp;
  onDelete?: () => void;
  userId: string;
  feed: feedAuthor;
}

export function Comment({
  author,
  content,
  onDelete,
  userId,
  feed,
}: CommentProps) {
  const canDelete = userId === author.id || userId === feed?.authorId;
  return (
    <div className="flex items-start  justify-between  w-full">
      <Link href={`/profile/${author.username}`} className="flex-grow">
        <div className="flex items-start space-x-2 sm:space-x-4 ">
          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
            <AvatarImage src={author.profileImage} alt={author.username} />
            <AvatarFallback>{author.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <p className="font-semibold text-sm sm:text-base truncate">
              {author.username}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 break-words ">
              {content}
            </p>
          </div>
        </div>
      </Link>
      
      {canDelete && (
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
          aria-label="Delete comment"
        >
          <CircleX className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
}
