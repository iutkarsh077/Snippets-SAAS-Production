import { useState } from "react";
import { motion } from "framer-motion";
import { Clipboard, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../App.css";
import Link from "next/link";

export default function CodeCard({ snippet }: any) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        key={snippet.id}
        className="max-w-md w-full min-h-full flex flex-col justify-between bg-gray-900 dark:hover:shadow-xl dark: rounded-xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-1">
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
          <Link href={`/description/${snippet.id}`}>
            <SyntaxHighlighter
              language={snippet.programmingLanguage}
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
              {snippet.code}
            </SyntaxHighlighter>
          </Link>
        </div>
        <motion.div
          className="bg-gray-800  p-4 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="text-sm text-gray-400">
            {snippet.programmingLanguage}
          </span>
          <span className="text-sm text-gray-400">
            {snippet.code.split("\n").length}
          </span>
        </motion.div>
      </motion.div>
    </>
  );
}
