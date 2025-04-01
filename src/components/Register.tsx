"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { borderColor } from "@/constants/colors";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { User } from "@/library/zodSchema/registerSchema";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailActions } from "@/redux/emailSlice";
import { signIn } from "next-auth/react";
import { inter } from "@/constants/fonts";

type UserData = z.infer<typeof User>;
const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAgreement: false,
    },
    resolver: zodResolver(User),
  });

  const onSubmit: SubmitHandler<UserData> = async (data: UserData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const res = await axios.post("/api/register", payload);

      if (res.data.success) {
        dispatch(emailActions.setEmail({ data: data.email }));
        router.push(`/auth/verify-otp`);
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      if (error instanceof Error)
        setError("root", {
          type: "manual",
          message: error.message,
        });
    }
  };

  const googleSignup = async () => {
    await signIn("google", { callbackUrl: "/" });
  };
  return (
    <div className="w-screen min-h-screen py-10 flex justify-center items-center">
      <div
        className={`w-[450px]  ${borderColor.OnePx}  overflow-hidden rounded-lg shadow-sm  shadow-gray-900 backdrop-blur-sm px-6 pb-8`}
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="fullName"
              className={`${inter.className} text-[#fafafa] text-[14px] font-semibold`}
            >
              Full Name*
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="John Doe"
              className={`w-full h-[40px] bg-transparent rounded-lg ${borderColor.OnePx} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
            {errors.name && (
              <p style={{ color: "orangered" }}>{errors.name.message}</p>
            )}
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
              {...register("email")}
              placeholder="john.example@gmail.com"
              className={`w-full h-[40px] bg-transparent rounded-lg ${borderColor.OnePx} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
            {errors.email && (
              <p style={{ color: "orangered" }}>{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="password"
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Password*
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="*********"
              className={`w-full h-[40px] bg-transparent rounded-lg ${borderColor.OnePx} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
            {errors.password && (
              <p style={{ color: "orangered" }}>{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="confirmPassword"
              className={`${inter.className} font-semibold text-[14px] text-[#fafafa]`}
            >
              Confirm Password*
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="**********"
              className={`w-full h-[40px] bg-transparent rounded-lg ${borderColor.OnePx} placeholder:text-[#a1a1aa] px-3 text-[#fafafa] focus:outline-none focus:border-[3px] focus:border-[#6D28D9] `}
            />
            {errors.confirmPassword && (
              <p style={{ color: "orangered" }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              id="terms"
              {...register("isAgreement")}
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
          {errors.isAgreement && (
            <p style={{ color: "orangered" }}>{errors.isAgreement.message}</p>
          )}

          <button className="w-full h-[40px] text-[#fafafa]  bg-[#6D28D9] rounded-lg cursor-pointer">
            <p className={`${inter.className} text-[14px]`}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </p>
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
        <div className="w-full flex items-center gap-2 justify-center mt-6">
          <div className="flex-1/2 h-[1px] bg-[#a1a1aa]"></div>
          <p className={`text-[#a1a1aa] ${inter.className}`}>or</p>
          <div className="w-[40px] flex-1/2 h-[1px] bg-[#a1a1aa]"></div>
        </div>

        <button
          onClick={googleSignup}
          className="w-full cursor-pointer mt-5 h-[40px] flex items-center justify-center gap-1 text-[#fafafa] bg-[#6D28D9] rounded-lg"
        >
          <div>
            <FaGoogle />
          </div>
          <p>Sign in with Google</p>
        </button>
      </div>
    </div>
  );
};

export default Register;
