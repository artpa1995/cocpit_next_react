import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ClientProvider from '../app/components/ClientProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app">
          <ClientProvider>
            <NextAuthProvider>
              {children}
            </NextAuthProvider>
          </ClientProvider>
        </div>
        <script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>
      </body>
    </html>
  );
};

export default RootLayout;
