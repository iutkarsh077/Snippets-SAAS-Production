"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import LeftSideSnippet from "../_components/LeftSideSnippet";
import { useForm } from "react-hook-form";
import {
  changePasswordTypes,
  changePasswordResolver,
} from "@/types/ChangePasswordTypes";
import { ChangePasswordActions } from "../../../../actions/ChangePassword";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
const ChangePassword = ({userEmail}:{userEmail: string}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: changePasswordResolver,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const VerifyEmailForgotPassword = async (data: changePasswordTypes) => {
    if (data.password !== data.confirmPassword || !userEmail) {
      return;
    }
    setLoading(true)
    try {
        const userData = {
            confirmPassword: data.confirmPassword,
            password: data.password,
            email: userEmail
        }
      const res = await ChangePasswordActions(userData);
      if (res.status === false) {
        throw new Error(res.msg);
      }
      router.push("/sign-up");
    } catch (error) {
      console.log(error);
    }
    finally{
        setLoading(false);
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
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Reset Password
        </h2>
        <p className="text-gray-800 font-semibold text-sm sm:text-base">
          Change your Password here
        </p>

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
                Password
              </label>
            </div>
            <input
              id="password"
              type="text"
              {...register("password")}
              className="w-full px-4 py-3 rounded-xl outline-none bg-gray-100 transition"
              placeholder="elonmusk@gmail.com"
            />
            {errors.password?.message && (
              <div className="text-red-500 pt-2">{errors.password.message}</div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="confirmPassword"
              {...register("confirmPassword")}
              placeholder="********"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none transition"
            />
            {errors.confirmPassword?.message && (
              <div className="text-red-500 pt-2">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition duration-150 font-semibold flex items-center"
            type="submit"
          >
            {loading && <Loader2 className="animate-spin" />}
            Change Password
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

export default ChangePassword;
