import CredentialProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { connectToDb } from "./mongoose";
import { comparePassword } from "./functions";
import User from "./models/user";
// Define authOptions
export const authOptions: NextAuthOptions = {
  // Set the secret to the value of the NEXT_AUTH_SECRET environment variable
  secret: process.env.NEXT_AUTH_SECRET,

  // Set the session strategy to "jwt"
  session: {
    strategy: "jwt",
  },

  // Define the Credentials provider
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      // Define the authorize function
      authorize: async (credentials): Promise<any> => {
        try {
          // Connect to the database
          await connectToDb();

          // Find the user with the given email
          const user = await User.findOne({ email: credentials?.email });

          // If no user is found, throw an error
          if (!user) {
            throw new Error("No user found!");
          }

          // Compare the given password with the user's password
          const isValid = await comparePassword(
            credentials!.password,
            user.password
          );

          // If the password is invalid, throw an error
          if (!isValid) {
            throw new Error("Invalid password! Try again!");
          }

          // Return the user's id, name, and email
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          // If an error occurs, log it and return null
          console.log("Error checking");
          return null;
        }
      },
    }),
  ],

  // Define the session callback
  callbacks: {
    async session({ session }: { session: any }) {
      // Find the user with the given email
      const sessionUser = await User.findOne({ email: session.user.email });

      // Set the session user's id to the user's id
      session.user.id = sessionUser._id.toString();

      // Return the session
      return session;
    },
  },
};
