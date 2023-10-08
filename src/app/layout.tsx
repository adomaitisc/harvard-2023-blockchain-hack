import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/_utils/auth-options";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CommuteX",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
