import "./globals.css"
import type { ReactNode } from "react"
import Script from "next/script"

export const metadata = {
  title: "Loading..."
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
        <Script id="made-using" strategy="beforeInteractive">
          {"/* Made using https://github.com/Vex-Systems/instatus-wrapper/tree/main */"}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
