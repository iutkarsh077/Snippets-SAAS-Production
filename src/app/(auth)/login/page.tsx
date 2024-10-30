"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { loginResolver, loginTypes } from "@/types/LoginTypes";
import LeftSideSnippet from "../_components/LeftSideSnippet";
import { useState } from "react";
import ForgotPassword from "../_components/ForgotPassword";
import { LoginUser } from "../../../../actions/LoginAction";
import { useRouter } from "next/navigation";
import VerifyEmail from "../_components/VerifyEmail";

export default function SignIn() {
  const [renderPassword, setRenderPassword] = useState(false);
  const [renderVerifyEmail, setRenderVerifyEmail] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: loginResolver,
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const SignInSubmit = async (data: loginTypes) => {
    // console.log(data);
    try {
      const res = await LoginUser(data);
      if (res.status === false) {
        throw new Error(res.msg);
      }

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (renderPassword) {
    return <ForgotPassword />;
  }

  if(renderVerifyEmail){
    return <VerifyEmail/>
  }
  return (
    <div className="flex flex-col lg:flex-row w-full h-auto min-h-screen">
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
          Sign In
        </h2>
        <p className="text-gray-800 font-semibold text-sm sm:text-base">
          Welcome back
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(SignInSubmit)}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
        >
          {/* Username Field */}
          <div>
            <div className="flex justify-between">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Username/Email
              </label>
              <p className="text-sm font-semibold text-blue-500 hover:cursor-pointer hover:text-blue-700 hover:scale-x-105 hover:transition-all hover:ease-in-out mb-2" onClick={()=>setRenderVerifyEmail(true)}>
                Verify Email
              </p>
            </div>
            <input
              id="username"
              type="text"
              {...register("username")}
              className="w-full px-4 py-3 rounded-xl outline-none bg-gray-100 transition"
              placeholder="elonmusk"
            />
            {errors.username?.message && (
              <div className="text-red-500 pt-2">{errors.username.message}</div>
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
          <div
            className="flex items-center justify-between text-sm hover:cursor-pointer text-blue-500 font-semibold hover:text-blue-700"
            onClick={() => setRenderPassword(true)}
          >
            Forgot password?
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
          Dont have an account?{" "}
          <Link
            href="/sign-up"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
