import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./Navbar";

export const metadata: Metadata = {
  title: "數位退火研發推動計畫",
  description: "ncku math",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
      <NavBar></NavBar>
        {children}
        </body>
    </html>
  );
}
