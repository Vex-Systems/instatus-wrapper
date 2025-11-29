import "./globals.css"
import type { ReactNode } from "react"
import Script from "next/script"

export const metadata = {
  title: "x"
}

export const viewport = {
  width: "device-width",
  initialScale: 1
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <Script src="/config.js" strategy="beforeInteractive" />
      </head>
      <body>{children}</body>
    </html>
  )
}
