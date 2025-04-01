"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { Rowdies } from "next/font/google"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { type SubmitHandler, useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ResetPasswordSchema } from "@/library/zodSchema/resetPasswordSchema"
import { forgotPasswordAction } from "@/redux/fogotPasswordSlice"

const rowdies = Rowdies({
  weight: "700",
  subsets: ["latin"],
})

type ResetPasswordData = z.infer<typeof ResetPasswordSchema>

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")
  const dispatch = useDispatch()
  const { showPassword, resetMessage } = useSelector((store: RootState) => store.forgotPassword)

  useEffect(() => {
    if (!token || !email) dispatch(forgotPasswordAction.setResetMessage({ data: "Invalid reset link" }))
  }, [token, email, dispatch])

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(ResetPasswordSchema),
  })

  const onSubmit: SubmitHandler<ResetPasswordData> = async (data: ResetPasswordData) => {
    const newPassword = data.password
    try {
      const { data } = await axios.post("/api/reset-password", {
        email,
        token,
        newPassword,
      })
      dispatch(forgotPasswordAction.setResetMessage({ data: data.message }))
    } catch (error: unknown) {
      dispatch(forgotPasswordAction.setResetMessage("Something went wrong"))
      if (error instanceof Error)
        setError("root", {
          type: "manual",
          message: error.message,
        })
    }
  }

  return (
    <div className="w-full max-w-md bg-[#111111] rounded-lg p-8">
      <h1 className={`${rowdies.className} text-2xl font-bold text-white mb-2 text-center`}>Reset Password</h1>
      <p className="text-gray-400 mb-6 text-center">Create a new password for your account</p>

      {resetMessage && (
        <div className="mb-6 p-3 bg-[#1a1a1a] border border-[#333] rounded-md text-gray-300 text-sm">
          {resetMessage}{" "}
          <Link className="text-[#8b5cf6] hover:text-[#7c3aed]" href="/auth/login">
            Login
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...register("password")}
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] text-white rounded-md focus:border-[#8b5cf6] focus:outline-none pl-12 pr-12"
            />
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <button
              type="button"
              onClick={() => dispatch(forgotPasswordAction.setShowPassword())}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] text-white rounded-md focus:border-[#8b5cf6] focus:outline-none pl-12 pr-12"
            />
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !token || !email}
          className={`${rowdies.className} w-full h-12 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-md transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-[#8b5cf6] hover:text-[#7c3aed]">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}