"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { borderColor } from "@/constants/colors";
import { inter } from "@/constants/fonts";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@/library/zodSchema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";

type UserData = z.infer<typeof User>;
const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(User),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<UserData> = async (data: UserData) => {
    const payload = {
      email: data.email,
      password: data.password,
    };
    console.log(payload)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: payload.email,
        password: payload.password,
      });

      if (result?.error) {
        console.error("Login failed:", result.error);

        return;
      }

      router.push("/");
    } catch (error) {
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
    <div className="w-screen h-screen flex justify-center items-center">
      <div
        className={`w-[450px]  ${borderColor.OnePx}  overflow-hidden rounded-lg shadow-sm  shadow-gray-900 backdrop-blur-sm px-6 pb-8`}
      >
        <div className="py-6 w-full flex flex-col gap-2">
          <h1
            className={`${inter.className} text-[#fafafa] text-2xl font-bold`}
          >
            Login to your account
          </h1>
          <p className={`${inter.className} text-[#a1a1aa] text-[14px]`}>
            Enter your credentials to access your dashboard
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
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
          <div className="w-full text-[#6D28D9]">
            <Link href={`${inter.className} auth/forgot-password`}>
              Forgot password?
            </Link>
          </div>
          <button className="w-full h-[40px] text-[#fafafa]  bg-[#6D28D9] rounded-lg cursor-pointer">
            <p className={`${inter.className} text-[14px]`}>
              {isSubmitting ? "Logging..." : "Login"}
            </p>
          </button>
        </form>
        <div
          className={`${inter.className} text-[14px] flex items-center gap-1 text-[#a1a1aa] justify-center mt-5`}
        >
          <p>Don&apos;t have an account?</p>
          <Link className="text-[#6D28D9]" href={"/auth/register"}>
            Register
          </Link>
        </div>
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
          <p>Login with Google</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
