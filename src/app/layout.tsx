import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
export default function Layout({children}: {children: React.ReactNode}){
 return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-100"> 
          <Header></Header>
                {children}
            </div>
      </body>
    </html>
  );
}



 
