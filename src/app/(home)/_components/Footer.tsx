import { motion } from "framer-motion";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
export default function Footer() {
  return (
    <motion.footer
      className="bg-gray-900 border-t-3 text-white py-8 mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">

          <motion.div
            className="text-xl font-bold mb-4 md:mb-0"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Snippets
          </motion.div>

          
          <motion.div
            className="flex space-x-4 text-gray-400 break-words text-wrap flex-wrap gap-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link href="/" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/snippets" className="hover:text-white">
              Snippets
            </Link>
            <Link href="/userChat" className="hover:text-white">
              DevChat
            </Link>
            <Link href="/askAi" className="hover:text-white">
              Artify
            </Link>

            <Link href="/reviewUs" className="hover:text-white">
              Review Us
            </Link>
          </motion.div>

          {/* Social Media Icons */}
          <motion.div
            className="flex space-x-4 mt-4 md:mt-0"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link href="https://x.com/iutkarsh077" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-gray-400 hover:text-white" size={24} />
            </Link>
            <Link href="https://github.com/iutkarsh077" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-gray-400 hover:text-white" size={24} />
            </Link>
            <Link href="https://www.linkedin.com/in/utkarsh-singh-9467aa257/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-gray-400 hover:text-white" size={24} />
            </Link>
          </motion.div>
        </div>

        {/* Copyright Text */}
        <motion.div
          className="text-center text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          © {new Date().getFullYear()} SnippetApp. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
}
