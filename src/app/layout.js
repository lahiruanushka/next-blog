import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import FooterComponent from "./components/Footer";
import { ThemeProvider } from "next-themes";
import ThemeComponent from "./components/ThemeComponent";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeModeScript } from "flowbite-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ByteThoughts",
  description: "Generated by create next app",
  icons: {
    icon: "/images/book-svgrepo-com.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <ThemeModeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <ThemeComponent>
            <Header />
            {children}
            <FooterComponent />
          </ThemeComponent>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
