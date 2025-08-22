import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Manrope } from "next/font/google"
import "@/styles/globals.css"

const geist = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Medical Literature Classifier",
  description: "Interactive dashboard for medical literature classification system",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
