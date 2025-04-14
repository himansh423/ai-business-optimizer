import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/library/database/db";
import User from "@/library/model/User";

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, token, newPassword } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
  if (!isValidToken || Date.now() > user.resetPasswordExpires) {
    return NextResponse.json(
      { error: "Token expired or invalid" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json({ message: "Password reset successful" });
}
