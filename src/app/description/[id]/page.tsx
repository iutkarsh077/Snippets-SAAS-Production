"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Clipboard, Check, Send } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaRegComment } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { GetSinglePost } from "../../../../actions/GetSinglePost";
import { AddComments } from "../../../../actions/AddComments";
import { GetUserDetails } from "../../../../actions/GetUserDetails";
import Link from "next/link";
import { SnippetType } from "@/app/snippets/page";
import { GetAllSnippets } from "../../../../actions/GetAllSnippets";
import CodeCard from "@/app/(home)/_components/Card";
interface Author {
  name: string;
  username: string;
}

interface PostSnippet {
  id: string; // Unique identifier for the snippet
  programmingLanguage: string; // The programming language of the code snippet
  code: string; // The code snippet itself
  question: string; // The related question for the code snippet
  authorId: string; // The ID of the author
  createdAt: Date; // Timestamp for when the snippet was created
  updatedAt: Date; // Timestamp for when the snippet was last updated
  author: Author; // The author object containing the author's name and ID
}

export default function OneSnippet() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  const [singlePost, setSinglePost] = useState<PostSnippet | null>(null);
  const [createComment, setCreateComment] = useState(false);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState<any[] | null>(null);
  const [commentSendLoading, setCommentSendLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [snippets, setSnippets] = useState<SnippetType[] | null>(null);

  useEffect(() => {
    const getAllSnippets = async () => {
      const res = await GetAllSnippets();
      if (res && res.data) {
        // Generate an array of random unique indexes
        const randomIndexes: any = [];
        while (
          randomIndexes.length < 3 &&
          randomIndexes.length < res.data.length
        ) {
          const randomIndex = Math.floor(Math.random() * res.data.length);
          if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
          }
        }

        // Use the random indexes to select items from res.data
        const randomSnippets = randomIndexes.map(
          (index: number) => res.data[index]
        );
        setSnippets(randomSnippets);
      }
    };
    getAllSnippets();
  }, []);

  useEffect(() => {
    const getUniquePost = async () => {
      try {
        if (!id) {
          throw new Error("No id provided");
        }
        const res = await GetSinglePost(id);
        // console.log(res);
        const userId = await GetUserDetails();
        if (userId.status === false) {
          throw new Error(userId.msg);
        }

        setUserId(userId.decodeCookieValue?.id);
        setSinglePost(res.data as any);
        setShowComment(res.data!.comments);
        // console.log(res);
      } catch (error: any) {
        const errorMessage =
          error.response.data.msg || "An unknow error occured";
      }
    };
    getUniquePost();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(singlePost?.code as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = async () => {
    setCommentSendLoading(true);
    if (!id || !comment) {
      return;
    }
    const data = {
      postId: id,
      content: comment,
    };

    try {
      const res = await AddComments(data);
      if (res.status === false) {
        throw new Error(res.msg);
      }
      // console.log(res.data?.comments);
      setShowComment(res.data!.comments);
      setCreateComment(false);
    } catch (error: any) {
      const errorMessage = error.response.data || "An unknown error occured";
    } finally {
      setCommentSendLoading(false);
    }
  };

  return (
    <div className="w-full flex">
      <div className="xl:w-2/3 w-full pl-2 xl:pl-0 pr-2 xl:pr-0">
      {singlePost && (
        <div className="flex flex-col-reverse lg:ml-20 mt-14 w-full justify-center gap-x-10">
          <motion.div
            className="max-w-3xl w-full flex flex-col bg-gray-900 rounded-xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <div className="h-10 w-full mb-6 flex justify-around">
                <div className="h-10 w-full flex items-center">
                  <span className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {singlePost.author.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-semibold">
                    {singlePost.author.name}
                  </span>
                </div>
                {singlePost && userId && userId != singlePost.authorId && (
                  <Link href={`/sendMsg/${singlePost.author.username}`}>
                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Chat
                      </button>
                    </div>
                  </Link>
                )}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <motion.button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? <Check size={20} /> : <Clipboard size={20} />}
                </motion.button>
              </div>
              <SyntaxHighlighter
                language={singlePost.programmingLanguage}
                style={atomDark}
                class="example"
                customStyle={{
                  margin: 0,
                  padding: "16px",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  height: "100%",
                }}
              >
                {singlePost.code}
              </SyntaxHighlighter>
            </div>
            <motion.div
              className="bg-gray-800 p-4 flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-sm text-gray-400">
                {singlePost.programmingLanguage}
              </span>
              <span className="flex gap-x-5 items-center text-gray-400">
                <span className="text-sm text-gray-400">
                  {singlePost.code.split("\n").length}
                </span>
                <motion.div
                  className="hover:cursor-pointer"
                  whileHover={{ scale: 1.2, color: "#FFFFFF", rotate: 360 }}
                  onClick={() => setCreateComment(!createComment)}
                >
                  <FaRegComment />
                </motion.div>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-xl  mb-4 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Problem Statement
            </h3>
            <p className="text-gray-300 ">{singlePost.question}</p>
          </motion.div>
        </div>
      )}

      {createComment && (
        <div className="ml-20 overflow-hidden">
          <motion.div
            className="flex space-y-3 p-4 gap-x-4 rounded-md shadow-lg w-full max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <textarea
              placeholder="Add your comment..."
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              onChange={(e) => setComment(e.target.value)}
            />
            <motion.button
              className="px-4 flex items-center  gap-x-2 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddComment}
            >
              {commentSendLoading === true ? (
                <span className="loader flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </span>
              ) : (
                <>
                  Send <Send />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      )}

      {createComment === false && showComment && (
        <>
          <div className="xl:max-w-3xl w-full overflow-y-auto overflow-x-hidden example h-screen xl:pl-28 pt-4 pb-4  mt-10 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">
              Comments ({showComment.length})
            </h2>
            <motion.ul
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {showComment
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((comment: any) => (
                  <motion.li
                    key={comment.id}
                    className=" p-4 rounded-lg hover:border-l-2 hover:border-gray-700 bg-gray-900 hover:ease-in-out hover:cursor-pointer hover:duration-200 "
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {comment.author.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{comment.author.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-white pl-10">
                      {comment.content
                        .split("\n")
                        .map((code: string, index: number) => (
                          <>
                            <div key={index}>{code}</div>
                          </>
                        ))}
                    </p>
                  </motion.li>
                ))}
            </motion.ul>
          </div>
        </>
      )}
      </div>
      <div className=" space-y-14 w-1/3 mt-10 xl:block hidden">
        {snippets
          ?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 6)
          .map((snippet, index) => (
            <div key={index}>
              <CodeCard snippet={snippet} />
            </div>
          ))}
      </div>
    </div>
  );
}
