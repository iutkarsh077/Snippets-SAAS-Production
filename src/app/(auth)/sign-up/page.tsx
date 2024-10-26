"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { SignupResolver, signUpTypes } from "@/types/SignupTypes";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";
import { CheckUsernameUnique } from "../../../../actions/CheckUsernameAvailable";
import { Loader2 } from "lucide-react";
import { CreateUserAccount } from "../../../../actions/CreateUserAccount";
import LeftSideSnippet from "../_components/LeftSideSnippet";
import OtpForSignup from "../_components/OtpForSignup";

export default function SignUp() {
  const [myusername, setMyUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debouncedUsername = useDebounceCallback(setMyUsername, 500);
  const [renderOtpForSignup, setRenderOtpForSignup] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: SignupResolver,
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (myusername.length >= 3) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const isUsernameAvailable = await CheckUsernameUnique(myusername);
          if (isUsernameAvailable.status === false) {
            throw new Error(isUsernameAvailable.message);
          }
          setUsernameMessage(isUsernameAvailable.message);
        } catch (error: any) {
          setUsernameMessage(error.message);
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [myusername]);

  const SignupSubmit = async (data: signUpTypes) => {
    console.log(data);
    try {
      const res = await CreateUserAccount(data);
      if (res.status === false) {
        throw new Error(res.msg);
      }
      setRenderOtpForSignup(true);
      // console.log(res);

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  if(renderOtpForSignup){
    return <OtpForSignup username={myusername}/>
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-auto">
      {/* Left-side (hidden on small screens) */}
      <LeftSideSnippet />
      {/* Right-side (sign-up form) */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-3/5 px-6 sm:px-10 md:px-16 lg:px-20 py-10 sm:py-20 flex flex-col justify-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Sign up
        </h2>
        <p className="text-gray-800 font-semibold text-sm sm:text-base">
          Create a new account
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(SignupSubmit)}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
        >
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              onChange={(e) => debouncedUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none bg-gray-100 transition"
              placeholder="elonmusk"
            />
            {isCheckingUsername && <Loader2 className="animate-spin mt-2" />}
            <p
              className={`text-sm ${
                usernameMessage === "Username is available"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {usernameMessage}
            </p>

            {errors.username?.message && (
              <div className="text-red-500 pt-2">{errors.username.message}</div>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-4 py-3 rounded-xl outline-none bg-gray-100 transition"
              placeholder="Elon Musk"
            />
            {errors.name?.message && (
              <div className="text-red-500 pt-2">{errors.name.message}</div>
            )}
          </div>

          {/* Email Field */}
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
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl outline-none bg-gray-100 transition"
              placeholder="elonmusk@x.com"
            />
            {errors.email?.message && (
              <div className="text-red-500 pt-2">{errors.email.message}</div>
            )}
          </div>

          {/* Password Field */}
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
              {...register("password")}
              placeholder="********"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none transition"
            />
            {errors.password?.message && (
              <div className="text-red-500 pt-2">{errors.password.message}</div>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <a
              href="#"
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition duration-150 font-semibold"
            type="submit"
          >
            Sign Up
          </motion.button>
        </form>

        {/* Link to second page */}
        <p className="text-center text-sm font-semibold text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
