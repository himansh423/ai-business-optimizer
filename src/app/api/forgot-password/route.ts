import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/library/database/db";
import User from "@/library/model/User";
import { sendEmail } from "@/library/sendMail/sendMail";

export async function POST(req: Request) {
  await connectToDatabase();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(resetToken, 10);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/reset-password?token=${resetToken}&email=${email}`;
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    text: `Click here to reset your password: ${resetLink}`,
    html: `<p>Click here to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  });

  return NextResponse.json({ message: "Password reset email sent" });
}
