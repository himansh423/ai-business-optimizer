"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

const GoogleLoginButton = () => {
  const googleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <span>or</span>
      <Button onClick={googleLogin} variant="outline">
        Login with Google
      </Button>
    </div>
  );
};

export default GoogleLoginButton;
