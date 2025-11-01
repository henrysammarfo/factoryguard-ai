import type React from "react"
import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

// Load Geist fonts for proper design
const geist = Inter({ subsets: ["latin"], variable: "--font-geist", weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })
const geistMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-geist-mono", weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })

export const metadata: Metadata = {
  title: "FactoryGuard AI - Predictive Maintenance for Industry 4.0",
  description:
    "AI-powered predictive maintenance platform that reduces downtime by 40% and extends equipment life by 25%",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
