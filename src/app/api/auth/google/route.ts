import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Generate a random state for security
    const state = Math.random().toString(36).substring(2, 15)

    // Get the client ID from environment variables
    const googleClientId = process.env.AUTH_GOOGLE_ID

    // Make sure we have a client ID
    if (!googleClientId) {
      console.error("Missing GOOGLE_CLIENT_ID environment variable")
      return NextResponse.redirect(new URL(`/auth/login?error=Server configuration error`, request.url))
    }

    // Use an exact, hardcoded redirect URI that matches what's in Google Cloud Console
    // This is critical - it must EXACTLY match what you've configured in Google Cloud Console
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

    // Create Google OAuth URL
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    googleAuthUrl.searchParams.append("client_id", googleClientId)
    googleAuthUrl.searchParams.append("redirect_uri", redirectUri)
    googleAuthUrl.searchParams.append("response_type", "code")
    googleAuthUrl.searchParams.append("scope", "email profile")
    googleAuthUrl.searchParams.append("state", state)
    googleAuthUrl.searchParams.append("prompt", "select_account")

    // For debugging
    console.log("Redirecting to Google OAuth URL:", googleAuthUrl.toString())
    console.log("Using redirect URI:", redirectUri)

    // Redirect to Google OAuth
    return NextResponse.redirect(googleAuthUrl)
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.redirect(new URL(`/auth/login?error=Authentication failed`, request.url))
  }
}

