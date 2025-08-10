import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AIverse - Next-Gen AI Platform",
  description:
    "Unleash your creativity with revolutionary AI tools. Transform ideas into reality with cutting-edge technology.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
