import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";
import connectToDatabase from "@/library/database/db";
import User from "@/library/model/User";
import { sendEmail } from "@/library/sendMail/sendMail";
import jwt from "jsonwebtoken";

// Token generation function

interface User {
  _id: string;
  email: string;
}
function generateAuthToken(user: User) {
  return jwt.sign(
    {
      id: user._id.toString(), // Ensure ID is a string
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=No authorization code provided`, request.url)
      );
    }

    // Make sure we have the required environment variables
    const googleClientId = process.env.AUTH_GOOGLE_ID;
    const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;

    if (!googleClientId || !googleClientSecret) {
      console.error(
        "Missing Google OAuth credentials in environment variables"
      );
      return NextResponse.redirect(
        new URL(`/auth/login?error=Server configuration error`, request.url)
      );
    }

    // Use the same exact redirect URI as in the initial request
    // This MUST match what's configured in Google Cloud Console
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    // Exchange the code for tokens using axios
    let tokenData;
    try {
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // With axios, the response is already parsed
      tokenData = tokenResponse.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Token exchange error:", error);
        return NextResponse.redirect(
          new URL(
            `/auth/login?error=Failed to exchange code for token`,
            request.url
          )
        );
      }
    }

    if (!tokenData?.access_token) {
      console.error("No access token received:", tokenData);
      return NextResponse.redirect(
        new URL(`/auth/login?error=Failed to obtain access token`, request.url)
      );
    }

    // Get user info with the access token using axios
    let userData;
    try {
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      // With axios, the response is already parsed
      userData = userInfoResponse.data;
    } catch (error) {
      console.error("User info fetch error:", error);
      return NextResponse.redirect(
        new URL(`/auth/login?error=Failed to get user info`, request.url)
      );
    }

    if (!userData?.email) {
      console.error("User info missing email:", userData);
      return NextResponse.redirect(
        new URL(`/auth/login?error=Failed to get user email`, request.url)
      );
    }

    try {
      // Connect to database
      await connectToDatabase();

      // Check if user exists
      const existingUser = await User.findOne({ email: userData.email });

      let user;
      if (existingUser) {
        // If user wasn't verified before, mark them as verified now
        if (!existingUser.isVerified) {
          existingUser.isVerified = true;
        }

        // Update Google-specific information if needed
        if (!existingUser.googleId) {
          existingUser.googleId = userData.id;
        }

        // Update profile picture if it's changed or not set

        await existingUser.save();
        user = existingUser;
      } else {
        // Create a new user with Google data
        const newUser = new User({
          name: userData.name,
          email: userData.email,
          googleId: userData.id,
          isVerified: true,
          isAgreement: true,
        });

        user = await newUser.save();

        // Send welcome email
        try {
          await sendEmail({
            to: userData.email,
            subject: "Welcome to AI-Business-Optimizer",
            text: `Hello ${userData.name}, thank you for signing up with Google!`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to AI Business Optimizer!</h2>
                <p>Hello ${userData.name},</p>
                <p>Thank you for signing up with Google. Your account has been created and is ready to use.</p>
                <p>You can now access all features of our platform.</p>
                <br>
                <p>Thanks,</p>
                <p>The AI Business Optimizer Team</p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Continue with authentication even if email fails
        }
      }

      // Generate authentication token
      const token = generateAuthToken(user);

      // Direct access to cookies via NextResponse
      const response = NextResponse.redirect(new URL("/", request.url));

      // Set authentication cookie with proper settings
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: "/",
        sameSite: "lax",
      });

      // Add a success query parameter
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("auth", "success");

      return NextResponse.redirect(redirectUrl);
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=Database operation failed`, request.url)
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Google auth callback error:", error.message, error.stack);
      return NextResponse.redirect(
        new URL(
          `/auth/login?error=Authentication failed&reason=${encodeURIComponent(
            error.message || "Unknown error"
          )}`,
          request.url
        )
      );
    }
  }
}
