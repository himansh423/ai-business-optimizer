import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { NextResponse } from "next/server";
import connectToDatabase from "@/library/database/db";
import User from "@/library/model/User";

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const { email, otp } = await req.json();

    const user = await User.findOne({ email, otp });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP or Email" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      { success: true, message: "OTP verified, Registration successful" },
      { status: 200 }
    );

    response.headers.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "strict",
        path: "/",
      })
    );

    return response;
  } catch (error) {
    console.error("Server Error:", error);
    if (error instanceof Error)
      return NextResponse.json(
        { success: false, message: "Server error", error: error.message },
        { status: 500 }
      );
  }
}
