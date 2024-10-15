"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Hii");
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">
      
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex w-full lg:w-2/5 bg-black items-center justify-center"
      >
        <h1 className="text-white text-5xl md:text-7xl font-bold">SNIPPETS</h1>
      </motion.div>

     
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-3/5 lg:ml-36 lg:mr-20 p-6 sm:p-10 md:p-20 lg:p-32 flex flex-col justify-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Sign In
        </h2>
        <p className="text-gray-800 font-semibold mb-8">
          Sign in to your account
        </p>

        
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-2 text-gray-500 bg-white transition duration-150 shadow-sm"
          >
            <FcGoogle size={24} />
            <span>Sign in with Google</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-2 text-gray-500 bg-white transition duration-150 shadow-sm"
          >
            <FaApple size={24} />
            <span>Sign in with Apple</span>
          </motion.button>
        </div>

        
        <form
          onSubmit={handleSubmit}
          className="space-y-6 shadow-sm bg-white p-6 sm:p-8 rounded-2xl"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none bg-gray-100 transition"
              placeholder="elonmusk@x.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3  bg-gray-100  rounded-xl outline-none transition"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <a
              href="#"
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Forgot password?
            </a>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition duration-150 font-semibold"
            type="submit"
          >
            Sign In
          </motion.button>
        </form>

       
        <p className="mt-8 text-center text-sm font-semibold text-gray-600">
          Don't have an account?{" "}
          <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline">
            Second Page
          </Link>
        </p>
      </motion.div>
    </div>
  );
}