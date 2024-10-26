"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { TextGenerateEffect } from "@/components/text-generate-effect";
import { askAI } from "../../../actions/GeminiResponse";

const Artify = () => {
  const [input, setInput] = useState("");
  const [responseFromGemini, setResponseFromGemini] = useState<
    { question: string; answer: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAiResponse = async () => {
    if (!input.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsLoading(true);
    try {
      const res = await askAI({ question: input });
      if (res.status === false) {
        throw new Error("Something went wrong");
      }
      if (res.data) {
        const cleanedText = res.data.replace(/(\*\*|\*|```|`|``)/g, "");
        setResponseFromGemini((prev) => [
          ...prev,
          { question: input, answer: cleanedText },
        ]);
      }
      setInput("");
      inputRef.current?.focus();
    } catch (error: any) {
      const errorMessage = error ?? "An unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new response is added
    window.scrollTo(0, document.body.scrollHeight);
  }, [responseFromGemini]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAiResponse();
    }
  };
  return (
    <div className="min-h-screen p-4 pb-24">
      <AnimatePresence>
        {responseFromGemini.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className=" rounded-lg shadow-md p-6 "
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-600">
              Artify Response:
            </h2>
            <p className="whitespace-pre-wrap">
              {responseFromGemini.map((res: any, index: number) => (
                <div key={index}>
                  <p className="p-2 bg-blue-500 rounded-md mb-3 font-semibold">
                    {res.question
                      .split("    ")
                      .map((words: any, index: number) => (
                        <p key={index}>{words}</p>
                      ))}
                  </p>
                  <p className="">
                    {<TextGenerateEffect words={res.answer} />}
                  </p>
                  <hr className="opacity-45 dark:bg-white bg-black" />
                  <br />
                </div>
              ))}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 shadow-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-4xl mx-auto flex space-x-2">
          <input
            ref={inputRef}
            onKeyDown={handleKeyPress}
            type="text"
            placeholder="Ask Artify anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            onClick={handleAiResponse}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Artify"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Artify;
