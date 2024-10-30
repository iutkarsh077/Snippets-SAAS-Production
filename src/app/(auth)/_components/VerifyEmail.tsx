"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import LeftSideSnippet from "../_components/LeftSideSnippet";
import { useForm } from "react-hook-form";
import {
  VerifyEmailforgotPasswordResolver,
  VerifyEmailforgotPasswordTypes,
} from "@/types/forgotPasswordTypes";
import { useState } from "react";
import ChangePassword from "./ChangePassword";
import { SentMailForForgotPassword } from "../../../../actions/SentMailForForgotPassword";
import { Loader2 } from "lucide-react";
import { VerifyEmailForForgotPassword } from "../../../../actions/VerifyEmailForForgotPassword";
import { useRouter } from "next/navigation";

const VerifyEmail = () => {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: VerifyEmailforgotPasswordResolver,
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const sendVerificationOtp = async () => {
    setLoading(true);
    if (!userEmail) {
      return;
    }
    try {
      const res = await SentMailForForgotPassword({ email: userEmail });
      if (res.status === false) {
        throw new Error(res.msg);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const VerifyEmailForgotPassword = async (
    data: VerifyEmailforgotPasswordTypes
  ) => {
    if (!data.email || !data.otp) {
      return;
    }
    try {
      console.log(data);
      const res = await VerifyEmailForForgotPassword(data);
      if (res.status === false) {
        throw new Error(res.msg);
      }
      console.log(res);
      router.push("/sign-up");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-auto min-h-screen">
      <LeftSideSnippet />

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-3/5 px-6 sm:px-10 md:px-16 lg:px-20 py-10 sm:py-20 flex flex-col justify-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white text-gray-800 mb-4">
          Verify Email
        </h2>
        

        {/* Form */}
        <form
          onSubmit={handleSubmit(VerifyEmailForgotPassword)}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
        >
          <div>
            <div className="flex justify-between">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <p
                className="text-blue-500 hover:cursor-pointer hover:text-blue-700 font-semibold flex items-center gap-x-3"
                onClick={sendVerificationOtp}
              >
                {loading && <Loader2 className="animate-spin" />}
                Send Email
              </p>
            </div>
            <input
              id="email"
              type="text"
              {...register("email")}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none dark:text-black bg-gray-100 transition"
              placeholder="elonmusk@gmail.com"
            />
            {errors.email?.message && (
              <div className="text-red-500 pt-2">{errors.email.message}</div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Enter OTP here
            </label>
            <input
              id="otp"
              type="otp"
              {...register("otp")}
              placeholder="872872"
              className="w-full px-4 py-3 dark:text-black bg-gray-100 rounded-xl outline-none transition"
            />
            {errors.otp?.message && (
              <div className="text-red-500 pt-2">{errors.otp.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition duration-150 font-semibold"
            type="submit"
          >
            Verify Email
          </motion.button>
        </form>

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
};

export default VerifyEmail;
