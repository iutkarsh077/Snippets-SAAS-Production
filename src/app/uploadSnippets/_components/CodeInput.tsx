"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Clipboard, Check, Edit, Eye, ArrowRight } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast, ToastContainer } from "react-toastify";

export default function CodeCard({
  code,
  setCode,
  setShowCodeCard,
  setShowSearchLanguage,
}: {
  code: string;
  setCode: any;
  setShowCodeCard: any;
  setShowSearchLanguage: any;
}) {
  //   const [code, setCode] = useState()
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = () => {
    if(code.length === 0){
      return;
    }
    setShowCodeCard(false);
    setShowSearchLanguage(true);
  };

  return (
    <>
    <ToastContainer/>
      <motion.div
        className="max-w-2xl w-full bg-gray-900 rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex space-x-2">
              <motion.button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={toggleEdit}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isEditing ? <Eye size={20} /> : <Edit size={20} />}
              </motion.button>
              <motion.button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={copyToClipboard}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {copied ? <Check size={20} /> : <Clipboard size={20} />}
              </motion.button>
            </div>
          </div>
          <motion.div
            initial={false}
            animate={{ height: isEditing ? "auto" : "200px" }}
            transition={{ duration: 0.3 }}
          >
            {isEditing ? (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Example: const languages = ['JavaScript', 'Python', 'Ruby'];"
                spellCheck="false"
                className="w-full h-48 p-4 example bg-gray-900 text-white font-mono text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <SyntaxHighlighter
                language="javascript"
                style={atomDark}
                customStyle={{
                  margin: 0,
                  padding: "16px",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  height: "200px",
                  overflow: "auto",
                }}
              >
                {code}
              </SyntaxHighlighter>
            )}
          </motion.div>
          <motion.div
            className="bg-gray-800 p-4 flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-sm text-gray-400">JavaScript</span>
            <span className="text-sm text-gray-400">
              {code.split("\n").length} lines
            </span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={handleSubmit}
            className={`
        inline-flex items-center mt-5 justify-center px-6 py-3
        bg-primary text-white dark:text-black
        rounded-full font-semibold text-lg
        shadow-md hover:shadow-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
          >
            <span>Next</span>
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
