import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { programmingLanguages as languages } from "@/lib/LanguageData";
import { Search, ChevronDown, ArrowRight } from "lucide-react";

export default function SearchLanguage({
  lang,
  setLang,
  setShowSearchLanguage,
  setshowDescriptionBox,
}: {
  lang: string,
  setLang: any;
  setShowSearchLanguage: any;
  setshowDescriptionBox: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const filteredLanguages = languages.filter((lang) =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if(lang.length === 0) return;
    setShowSearchLanguage(false);
    setshowDescriptionBox(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 w-full ">
      <div className="relative">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
        >
          <span>
            {filteredLanguages.length > 0
              ? filteredLanguages[0]
              : "No languages found"}
          </span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 dark:bg-black bg-white example w-full mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredLanguages.map((language, index) => (
                <motion.li
                  key={index}
                  //   whileHover={{ backgroundColor: "#f3f4f6" }}
                  className="px-4 py-2 cursor-pointer text-white"
                  onClick={() => {
                    setSearchTerm(language);
                    setIsOpen(false);
                    setLang(language);
                  }}
                >
                  {language}
                </motion.li>
              ))}
            </motion.ul>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={handleSubmit}
            className={`
        inline-flex items-center mt-5 justify-center px-6 py-3
        bg-primary text-primary-foreground
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
        </AnimatePresence>
      </div>
    </div>
  );
}
