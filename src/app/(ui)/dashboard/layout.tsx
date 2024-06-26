import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import GlobalMargin from "@/components/ui/global-margin";
import Navbar from "@/components/ui/static-navbar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import GlobalProvider from "@/components/globals/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return (
    <html lang="en">
      <body className={cn(inter.className, "dark bg-black max-h-screen")}>
        <GlobalProvider>
          <Navbar />
          <GlobalMargin>{children}</GlobalMargin>
          <Toaster />
        </GlobalProvider>
      </body>
    </html>
  );
}
