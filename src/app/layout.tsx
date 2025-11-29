import "./globals.css"
import type { ReactNode } from "react"

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
      <body>{children}</body>
    </html>
  )
}
