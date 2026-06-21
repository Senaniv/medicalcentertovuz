import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MEDİCAL CENTER Tibb Mərkəzi | Tovuz",
  description: "Tovuzda yerləşən MEDİCAL CENTER Tibb Mərkəzi. Sağlamlığınız Bizim Dəyərimizdir. Laboratoriya, USM, KT, Fizioterapiya, Ortopedik içliklər və digər tibbi xidmətlər.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={`${inter.variable} font-sans h-full scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full bg-[#F8FAFC] text-[#1E293B] antialiased flex flex-col">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
