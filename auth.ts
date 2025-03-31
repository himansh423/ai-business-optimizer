import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/library/model/User";
import { compare } from "bcryptjs";
import connectToDatabase from "@/library/database/db";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;
        if (!email || !password)
          throw new Error("Please enter your email and password");
        await connectToDatabase();
        const user = await User.findOne({ email }).select("+password");

        if (!user) throw new CredentialsSignin("User not found");

        if (!user.password)
          throw new CredentialsSignin("Invalid email or password");

        const isMatch = await compare(password, user.password);

        if (!isMatch) throw new CredentialsSignin("Invalid email or password");
        return { email: user.email, name: user.name, id: user._id };
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: { signIn: "/auth/login" },

  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;
          await connectToDatabase();
          const alreadyUser = await User.findOne({ email });
          if (!alreadyUser) {
            const newUser = new User({
              email,
              name,
              image,
              googleId: id,
            });
            await newUser.save();
          }

          return true;
        } catch (error) {
          throw new AuthError("Error while signing in with google");
        }
      }
      return false;
    },
  },
});
