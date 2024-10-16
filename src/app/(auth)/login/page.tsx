"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { loginResolver, loginTypes } from "@/types/LoginTypes";

export default function SignIn() {
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

  const SignInSubmit = (data: loginTypes) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-auto">
      {/* Left-side (hidden on small screens) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex w-full lg:w-2/5 bg-black items-center justify-center"
      >
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold">
          SNIPPETS
        </h1>
      </motion.div>

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
          onSubmit={handleSubmit(SignInSubmit)}
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
            href="/dashboard"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
