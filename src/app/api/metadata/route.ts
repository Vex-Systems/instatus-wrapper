import { getIframeUrl } from "../../../server/config"
const CACHE_TTL_MS = 15 * 60 * 1000
type Meta = { title: string; favicon: string; ts: number; og?: Record<string, string>; twitter?: Record<string, string> }
const cache = new Map<string, Meta>()
const inflight = new Map<string, Promise<any>>()

function attr(tag: string, name: string) {
  const re = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^>\\s]+))`, "i")
  const m = tag.match(re)
  return m ? m[2] || m[3] || m[4] || "" : ""
}

function parseMeta(html: string, base: URL) {
  const tMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = tMatch ? tMatch[1].trim() : ""
  const links = [...html.matchAll(/<link\b[^>]*>/gi)]
  let iconHref = ""
  for (const m of links) {
    const tag = m[0]
    const rel = attr(tag, "rel").toLowerCase()
    if (rel.includes("icon") || rel.includes("shortcut icon") || rel.includes("apple-touch-icon")) {
      const href = attr(tag, "href")
      if (href) {
        try {
          iconHref = new URL(href, base.toString()).toString()
          break
        } catch {}
      }
    }
  }
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)]
  const og: Record<string, string> = {}
  const tw: Record<string, string> = {}
  for (const m of metaTags) {
    const tag = m[0]
    const prop = attr(tag, "property")
    const name = attr(tag, "name")
    const content = attr(tag, "content")
    const key = (prop || name || "").toLowerCase()
    if (!key || !content) continue
    if (key.startsWith("og:")) {
      const k = key.slice(3)
      og[k] = content
    } else if (key.startsWith("twitter:")) {
      const k = key.slice(8)
      tw[k] = content
    }
  }
  if (og["image"]) {
    try { og["image"] = new URL(og["image"], base.toString()).toString() } catch {}
  }
  if (!og["url"]) og["url"] = base.toString()
  return { title, favicon: iconHref, og, twitter: tw }
}

async function refresh(url: URL) {
  const resp = await fetch(url.toString(), { cache: "no-store", headers: { accept: "text/html" } })
  if (!resp.ok) throw new Error("upstream_error:" + resp.status)
  const html = await resp.text()
  const parsed = parseMeta(html, url)
  cache.set(url.toString(), { title: parsed.title, favicon: parsed.favicon, og: parsed.og, twitter: parsed.twitter, ts: Date.now() })
  return parsed
}

export async function GET(request: Request) {
  try {
    const abs = getIframeUrl()

    const key = abs.toString()
    const now = Date.now()
    const cached = cache.get(key)
    const headers = { "content-type": "application/json", "cache-control": "public, max-age=900", "x-cache-ttl": String(CACHE_TTL_MS) }

    if (cached) {
      const age = now - cached.ts
      if (age < CACHE_TTL_MS) {
        return new Response(JSON.stringify({ title: cached.title, favicon: cached.favicon, og: cached.og, twitter: cached.twitter, cached_at: cached.ts, age_ms: age, source: "hit" }), { status: 200, headers })
      }
      if (!inflight.has(key)) {
        const p = refresh(abs).catch(() => {})
        inflight.set(key, p)
        p.finally(() => inflight.delete(key))
      }
      return new Response(JSON.stringify({ title: cached.title, favicon: cached.favicon, og: cached.og, twitter: cached.twitter, cached_at: cached.ts, age_ms: age, source: "stale" }), { status: 200, headers })
    }

    try {
      const parsed = await refresh(abs).catch(() => undefined)
      const fresh = cache.get(key)!
      return new Response(JSON.stringify({ title: fresh.title, favicon: fresh.favicon, og: parsed?.og, twitter: parsed?.twitter, cached_at: fresh.ts, age_ms: 0, source: "miss" }), { status: 200, headers })
    } catch (e: any) {
      return new Response(JSON.stringify({ error: "upstream_error", message: String(e) }), { status: 502, headers })
    }
  } catch {
    return new Response(JSON.stringify({ error: "unknown" }), { status: 500, headers: { "content-type": "application/json" } })
  }
}
