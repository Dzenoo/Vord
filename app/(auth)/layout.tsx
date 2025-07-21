import type { Metadata } from "next";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "@/context/AuthProvider";

export const metadata: Metadata = {
  title: "Chatcord",
  description:
    "This is a Discord Clone Application built with Next.js, Typesscript and Tailwind CSS",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
}
