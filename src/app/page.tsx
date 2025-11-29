"use client"
import { useEffect, useState } from "react"

export default function Page() {
  const [loaded, setLoaded] = useState(false)
  const [logoOk, setLogoOk] = useState(true)
  const [src, setSrc] = useState("")
  const [metaReady, setMetaReady] = useState(false)

  useEffect(() => {
    const s = typeof window !== "undefined" && (window as any).__INSTATUS_WRAPPER__?.iframeSrc
    setSrc(typeof s === "string" && s.length ? s : "https://vex-systems.instatus.com/")
  }, [])

  useEffect(() => {
    let active = true
    async function run() {
      if (!src) return
      try {
        const r = await fetch(`/api/metadata`, { cache: "no-store" })
        if (!active) return
        if (r.ok) {
          const j = await r.json()
          if (j?.title) document.title = j.title
          if (j?.favicon) {
            let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null
            if (!link) {
              link = document.createElement("link")
              link.rel = "icon"
              document.head.appendChild(link)
            }
            link.href = j.favicon
          }
          const setMeta = (key: string, value?: string, attr: "property" | "name" = "property") => {
            if (!value) return
            let el = document.head.querySelector(`meta[${attr}='${key}']`) as HTMLMetaElement | null
            if (!el) {
              el = document.createElement("meta")
              el.setAttribute(attr, key)
              document.head.appendChild(el)
            }
            el.setAttribute("content", value)
          }
          if (j?.og) {
            setMeta("og:title", j.og.title)
            setMeta("og:description", j.og.description)
            setMeta("og:url", j.og.url)
            setMeta("og:image", j.og.image)
            setMeta("og:type", j.og.type)
            setMeta("og:site_name", j.og.site_name)
          }
          if (j?.twitter) {
            setMeta("twitter:card", j.twitter.card, "name")
            setMeta("twitter:title", j.twitter.title, "name")
            setMeta("twitter:description", j.twitter.description, "name")
            setMeta("twitter:image", j.twitter.image, "name")
          }
        }
      } finally {
        if (active) setMetaReady(true)
      }
    }
    run()
    const iv = setInterval(run, 15 * 60 * 1000)
    return () => {
      active = false
      clearInterval(iv)
    }
  }, [src])

  return (
    <div className="c">
      <div id="s" className={loaded ? "spinner hidden" : "spinner"} />
      {src && metaReady && (
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
