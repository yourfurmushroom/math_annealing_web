import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./Navbar";
import ContactUs from "./ContactUs";
import Footer from "./Component/Footer";

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
        <NavBar />
        <div className="flex-1 [--navbar-offset:120px] pt-[var(--navbar-offset)] lg:[--navbar-offset:8vh]">
          {children}
        </div>
        <ContactUs></ContactUs>
        <Footer></Footer>
      </body>
    </html>
  );
}
