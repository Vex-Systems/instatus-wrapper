"use client"
import { useEffect, useState } from "react"

export default function Page() {
  const [loaded, setLoaded] = useState(false)
  const [logoOk, setLogoOk] = useState(true)
  const [src, setSrc] = useState("")

  useEffect(() => {
    const s = typeof window !== "undefined" && (window as any).__INSTATUS_WRAPPER__?.iframeSrc
    setSrc(typeof s === "string" && s.length ? s : "https://vex-systems.instatus.com/")
  }, [])

  return (
    <div className="c">
      <div id="s" className={loaded ? "spinner hidden" : "spinner"} />
      {src && (
        <iframe
          id="f"
          className={loaded ? "frame visible" : "frame"}
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          src={src}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  )
}
