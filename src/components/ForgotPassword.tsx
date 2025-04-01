"use client"
import axios from "axios"
import { Mail } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { z } from "zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Email } from "@/library/zodSchema/ForgotPasswordSchema"
import type { RootState } from "@/redux/store"
import { forgotPasswordAction } from "@/redux/fogotPasswordSlice"
import Link from "next/link"
import { inter } from "@/constants/fonts"



type EmailData = z.infer<typeof Email>

export default function ForgotPassword() {
  const { message } = useSelector((store: RootState) => store.forgotPassword)
  const dispatch = useDispatch()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(Email),
  })

  const onSubmit: SubmitHandler<EmailData> = async (data: EmailData) => {
    const payload = { email: data.email }
    try {
      const { data } = await axios.post("/api/forgot-password", payload)
      dispatch(forgotPasswordAction.setMessage({ data: data.message }))
    } catch (error: unknown) {
      dispatch(forgotPasswordAction.setMessage("Something went wrong"))
      if (error instanceof Error)
        setError("root", {
          type: "manual",
          message: error.message,
        })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-[#111111] rounded-lg p-8">
        <h1 className={`${inter.className} text-2xl font-bold text-white mb-2 text-center`}>Forgot Password</h1>
        <p className="text-gray-400 mb-6 text-center">Enter your email to receive a password reset link</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] text-white pl-12"
            />
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${inter.className} w-full h-12 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-md transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-3 bg-[#1a1a1a] border border-[#333] rounded-md text-gray-300 text-sm">{message}</div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-[#8b5cf6] hover:text-[#7c3aed]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

