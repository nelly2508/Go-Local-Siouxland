# Go Local Siouxland

A modern local-business directory for the Siouxland tri-state area (Sioux City, IA · South Sioux City, NE · North Sioux City, SD · Dakota Dunes, SD).

Static, self-contained site (HTML/CSS/vanilla JS) served by a tiny zero-dependency Node server so it runs cleanly on Railway. In-page hash routing powers the Home, Explore, Listing-detail and Pricing views.

---

## What's inside

```
index.html        The entire site (markup, styles, data and logic inlined)
server.js         Minimal Node static server (binds to $PORT on 0.0.0.0)
package.json       start script -> node server.js
railway.json       Railway build/deploy config (Nixpacks)
assets/img/        Logo, hero image and the 10 category photos
```

## Run locally

Requires Node 18+.

```bash
npm start
# then open http://localhost:3000
```

(No `npm install` needed — there are no dependencies.)

---

## Deploy to Railway (from GitHub)

1. Go to **https://railway.app** and sign in.
2. Click **New Project → Deploy from GitHub repo**.
3. Authorise Railway to access your GitHub account and pick this repository.
4. Railway auto-detects Node, runs `npm start`, and builds. Wait for **"Success"**.
5. Open the service → **Settings → Networking → Generate Domain** to get a free
   `https://<your-app>.up.railway.app` URL and confirm the site is live.

That free Railway URL is enough to share the site immediately. To use your own
domain, continue below.

---

## Point golocalsiouxland.com at Railway (apex domain via Cloudflare)

You want the site on the **root** domain `golocalsiouxland.com`.

### 1. Add the domain in Railway
- Service → **Settings → Networking → Custom Domain**.
- Enter `golocalsiouxland.com`.
- Railway shows a **CNAME target** (looks like `abcd1234.up.railway.app`). Copy it.
- (Optional) also add `www.golocalsiouxland.com` and copy its target too.

### 2. Add the DNS record in Cloudflare
- In Cloudflare → your domain → **DNS → Records**.
- **First remove the old records** that pointed at the previous WordPress site —
  the root `A`/`AAAA` records (and any `www` `A`/`CNAME`). 
- **Add a new record:**
  - **Type:** `CNAME`
  - **Name:** `@`  (this is the root/apex — Cloudflare's *CNAME flattening* makes this legal)
  - **Target:** the Railway target you copied (e.g. `abcd1234.up.railway.app`)
  - **Proxy status:** **DNS only** (grey cloud) — important, so Railway can issue its own SSL certificate.
- (Optional) add `www` as a `CNAME` to the same target, also **DNS only**.

### 3. Wait for SSL
- Once DNS resolves, Railway automatically provisions a Let's Encrypt certificate
  (usually a few minutes). Your site will then be live at `https://golocalsiouxland.com`.

### Important
- **Do NOT change your `MX` records or any email/other records** — only touch the
  web `A`/`AAAA`/`CNAME` records described above.
- Pointing the apex here **replaces** the old (broken) WordPress site on this domain.
- If you prefer to keep Cloudflare's proxy on (orange cloud) for caching/DDoS, set
  Cloudflare **SSL/TLS mode to "Full (strict)"** first, otherwise you may see a
  redirect loop. The simplest reliable setup is **DNS only**, as above.

---

## Updating the site later
Edit `index.html` (or the `assets/`), commit, and push to GitHub — Railway
redeploys automatically on every push to the connected branch.
