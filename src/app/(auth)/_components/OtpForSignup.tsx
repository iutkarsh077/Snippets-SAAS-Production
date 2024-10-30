"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LeftSideSnippet from "./LeftSideSnippet";
import { VerifyUserAtSignup } from "../../../../actions/VerifyUserAtSignup";
import { useRouter } from "next/navigation";

const otpSchema = z.object({
  otp: z
    .string()
    .min(4, {
      message: "Otp must be at least 4 characters",
    })
    .max(20, {
      message: "Otp cannot exceed 20 characters",
    }),
});

type OtpType = z.infer<typeof otpSchema>;

const OtpForSignup = ({ username }: { username: string }) => {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const OtpSubmit = async (data: OtpType) => {
    try {
      const mydata = {
        otp: data.otp,
        username: username,
      };
      const res = await VerifyUserAtSignup(mydata);

      if (res.status === false) {
        throw new Error(res.msg);
      }

      // console.log(res);
      router.push("/login");
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
        className="w-full lg:w-3/5 px-6 sm:px-10 md:px-16 lg:px-20 py-10 sm:py-20 flex flex-col justify-center "
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white text-gray-800 mb-4">
          Sign up
        </h2>
        <p className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">
          Create a new account
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(OtpSubmit)}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
        >
          {/* OTP Field */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Enter your OTP Here
            </label>
            <input
              id="otp"
              type="text"
              {...register("otp")}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl dark:text-black outline-none bg-gray-100 transition"
              placeholder="8767"
            />

            {/* Display validation error */}
            {errors.otp?.message && (
              <div className="text-red-500 pt-2">{errors.otp.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OtpForSignup;
