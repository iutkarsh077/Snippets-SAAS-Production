"use client"
import {  useEffect, useState } from "react";
import { motion } from "framer-motion";
import SwitchToggle from "@/components/Toggle/Switch";
import { IoCloudUpload } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GetUserDetails } from "../../actions/GetUserDetails";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const path = usePathname();
  
  useEffect(()=>{
    const getUserDetails = async () =>{
      try {
        const res = await GetUserDetails();
        console.log(res);
        if(res.status === false){
          throw new Error(res.msg);
        }
        setUserDetails(res.decodeCookieValue);
      } catch (error) {
        console.log(error)
      }
    }
    getUserDetails();
  }, [])

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Snippets", href: "/snippets" },
    { name: "DevChat", href: "/userChat" },
    { name: "ArtifyAI", href: "/askAi" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      className="z-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center  font-bold text-2xl">
            <Link href="/">SNIPPETS</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className=" text-lg font-medium duration-200"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-x-5">
            <Link
              href="/uploadSnippets"
              className={`${
                path === "/snippets" ? "block" : "hidden"
              }`}
            >
              <IoCloudUpload className="text-2xl font-semibold" />
            </Link>
            {/* <SwitchToggle /> */}
            {userDetails ? (
              <Link href={`/profile`} className="font-semibold">
                <div>{userDetails.name}</div>
              </Link>
            ) : (
              <Link
                href={"/login"}
                className="bg-black pt-2 pb-2 pl-4 pr-4 hover:bg-gray-800 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-400 hover:ease-in-out hover:transition-all hover:duration-300 font-semibold text-white rounded-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-indigo-700"
        >
          <ul className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={link.href}
                  className="text-white text-lg font-medium hover:text-indigo-300"
                >
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
}
