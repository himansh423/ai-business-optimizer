import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import User from "@/library/model/User";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import connectToDatabase from "@/library/database/db";

const Register = () => {
  const signUp = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!name || !email || !password)
      throw new Error("Please enter all fields");

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (user) throw new Error("User already exists");

    const hasdedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hasdedPassword });

    redirect("/auth/login");
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signUp} className="flex flex-col gap-2">
            <Input type="text" placeholder="Name" name="name" />
            <Input type="email" placeholder="Email" name="email" />
            <Input type="password" placeholder="Password" name="password" />
            <Button type="submit">Register</Button>
          </form>
        </CardContent>
        <CardContent>
          <form action="" className="flex flex-col gap-2 items-center">
            <span>or</span>
            <Button type="submit" variant={"outline"}>
              Register with Google
            </Button>
          </form>
          <Link href="/auth/login" className="mt-2">
            Already have an account? Login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
