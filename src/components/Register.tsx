"use client";
import { redirect } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { borderColor } from "@/constants/colors";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
});
const Register = () => {
  const dispatch = useDispatch();
  const signUp = async () => {
    try {
      const res = await axios.post("/api/register", { name });
      if (res.data.success) {
        redirect("/auth/verify-otp");
        // dispatch(emailActions.setEmail({}))
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div
        className={`w-[450px] h-[85vh] ${borderColor.OnePx}  overflow-hidden rounded-lg shadow-sm  shadow-gray-900 backdrop-blur-sm px-6`}
      >
        <div className="py-6 w-full flex flex-col gap-2">
          <h1
            className={`${inter.className} text-[#fafafa] text-2xl font-bold`}
          >
            Create an account
          </h1>
          <p className={`${inter.className} text-[#a1a1aa] text-[14px]`}>
            Enter your information to get started with AI Business Optimizer
          </p>
        </div>
        <form action="" className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="fullName"
              className={`${inter.className} text-[#fafafa] text-[14px] font-semibold`}
            >
              Full Name*
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className={`w-full h-[40px] bg-transparent rounded-lg ${borderColor.OnePx} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="email"
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Email*
            </label>
            <input
              type="email"
              placeholder="john.example@gmail.com"
              className={`w-full h-[40px] bg-transparent rounded-lg ${borderColor.OnePx} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="password"
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Password*
            </label>
            <input
              type="password"
              placeholder="*********"
              className={`w-full h-[40px] bg-transparent rounded-lg ${borderColor.OnePx} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="confirmPassword"
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Confirm Password*
            </label>
            <input
              type="password"
              placeholder="**********"
              className={`w-full h-[40px] bg-transparent rounded-lg ${borderColor.OnePx} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 rounded border-gray-300"
            />
            <p className="text-[#a1a1aa]">
              I agree to the{" "}
              <Link href={"/terms-and-service"} className="text-[#6D28D9]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href={"/privacy-policy"} className="text-[#6D28D9]">
                Privacy Policy
              </Link>
            </p>
          </div>

          <button className="w-full h-[40px] text-[#fafafa]  bg-[#6D28D9] rounded-lg">
            <p className={`${inter.className} text-[14px]`}>Create Account</p>
          </button>
        </form>

        <p
          className={`${inter.className} text-[14px] mt-4 text-center text-[#a1a1aa]`}
        >
          Already have an account?{" "}
          <Link href={"/auth/login"} className="text-[#6D28D9]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
