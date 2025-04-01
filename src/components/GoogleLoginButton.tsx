"use client";
import { signIn } from "next-auth/react";


const GoogleLoginButton = () => {
  const googleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <span>or</span>
      <button onClick={googleLogin}>
        Login with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
