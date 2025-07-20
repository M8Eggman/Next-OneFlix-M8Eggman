import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./providers/ReduxProvider";
import Layout from "@/components/layout/Layout";
import NextAuthSessionProvider from "./providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oneflix",
  description: "Projet final de la formation Front-end de Molengeek 2025 - Oneflix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <NextAuthSessionProvider>
            <Layout>
              <main>{children}</main>
            </Layout>
          </NextAuthSessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
