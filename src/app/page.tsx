"use client"
import { useEffect, useMemo, useState } from "react"

export default function Page() {
  const [loaded, setLoaded] = useState(false)
  const [logoOk, setLogoOk] = useState(true)
  const src = useMemo(() => atob("aHR0cHM6Ly92ZXgtc3lzdGVtcy5pbnN0YXR1cy5jb20v"), [])

  useEffect(() => {
    const t = setTimeout(() => {}, 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="c">
      <div id="s" className={loaded ? "spinner hidden" : "spinner"} />
      <iframe
        id="f"
        className={loaded ? "frame visible" : "frame"}
        allow="fullscreen"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        src={src}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
