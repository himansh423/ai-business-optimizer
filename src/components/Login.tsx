"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const login = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      console.log("Please enter all fields");
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error("Login failed:", result.error);

        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={login} className="flex flex-col gap-2">
            <Input type="email" placeholder="email" name="email" />
            <Input type="password" placeholder="password" name="password" />
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
        <CardContent>
          <form action="" className="flex flex-col gap-2 items-center">
            <span>or</span>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
            >
              Login with Google
            </Button>
          </form>
          <Link href="/auth/register" className="mt-2">
            Don't have an account? Register
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
