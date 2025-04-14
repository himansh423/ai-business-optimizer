"use client";
import { useState, useRef, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Link from "next/link";

export default function Verify() {
  const router = useRouter();
  const { email } = useSelector((store: RootState) => store.email);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (!/^[0-9]{6}$/.test(enteredOtp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/verify-otp", {
        email,
        otp: enteredOtp,
      });
      if (res.data.success) {
        router.push("/");
      } else {
        setError(res.data.message || "Invalid OTP");
      }
    } catch (error: unknown) {
      if (error instanceof Error)
        setError(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-[#111111] rounded-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Verify your email
        </h1>
        <p className="text-gray-400 mb-6">
          Enter the 6-digit code sent to your email address
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between gap-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  }}
                  className="w-full h-12 bg-[#1a1a1a] border border-[#333] text-white text-center rounded-md focus:border-[#8b5cf6] focus:outline-none"
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-md transition-colors duration-200 font-medium"
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Didn&apos;t receive the code?{" "}
            <button className="text-[#8b5cf6] hover:text-[#7c3aed]">
              Resend code
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Back to{" "}
            <Link
              href="/auth/register"
              className="text-[#8b5cf6] hover:text-[#7c3aed]"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
