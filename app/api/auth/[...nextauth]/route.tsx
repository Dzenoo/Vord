import { authOptions } from "@/lib/session";
import NextAuth from "next-auth";

// Define the handler as NextAuth with authOptions
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST };
