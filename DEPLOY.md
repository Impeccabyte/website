# Deploying Impeccabyte on cPanel (CloudLinux Node.js Selector)

This app runs as a Node.js application under cPanel's **Setup Node.js App**
(CloudLinux Node.js Selector, powered by Phusion Passenger). Passenger launches
[`server.js`](./server.js), which boots the Next.js production server.

> **Requirements**
> - **Node.js 20.9+** available in the Node.js Selector (Next 16 requires it).
> - Outbound network access during the build (`next/font` downloads and
>   self-hosts the Google fonts at build time).
> - A domain or subdomain to point at the app.

---

## 1. Get the code onto the server

**Option A — cPanel Git™ Version Control (recommended)**

1. cPanel → **Git Version Control** → **Create**.
2. Clone URL: `https://github.com/Impeccabyte/website.git`
3. Repository path: e.g. `/home/USER/impeccabyte` (keep it **outside**
   `public_html`).
4. Later updates: **Manage → Pull or Deploy → Update from Remote**, then rebuild
   (step 4) and **Restart** (step 5).

**Option B — Upload**

Upload the project to a folder such as `/home/USER/impeccabyte` (via Git, File
Manager, or SFTP). Do **not** upload `node_modules/` or `.next/` — they are built
on the server.

---

## 2. Create the Node.js application

cPanel → **Setup Node.js App** → **Create Application**:

| Field | Value |
|---|---|
| Node.js version | **20.9 or newer** |
| Application mode | **Production** |
| Application root | the repo folder, e.g. `impeccabyte` |
| Application URL | your domain, e.g. `impeccabyte.com` |
| Application startup file | **`server.js`** |

Click **Create**. cPanel provisions a per-app virtualenv and writes the Passenger
config into the domain's `.htaccess` for you — **do not hand-edit that file.**

---

## 3. Set environment variables

In the app panel, add:

- `NODE_ENV` = `production` (usually set automatically in Production mode)

The public site URL used for absolute Open Graph/canonical links is set in
[`app/layout.tsx`](./app/layout.tsx) via `metadataBase`
(`https://impeccabyte.com`). **If you launch on a different domain, update that
value** and rebuild.

---

## 4. Install dependencies and build

The build needs the **devDependencies** (Tailwind, TypeScript), so a plain
production install is not enough. Open the app's virtualenv terminal — the
"Setup Node.js App" panel shows the exact `source …/bin/activate` command; run it,
then:

```bash
cd ~/impeccabyte           # your application root
npm install --include=dev  # installs prod + build tooling
npm run build              # produces .next/ (prerenders all 46 routes)
npm prune --omit=dev       # optional: drop build-only deps to slim runtime
```

Runtime only needs the production dependencies (`next` serves the prebuilt
`.next/`), so the optional `prune` is safe.

> No terminal access? Use the panel's **Run JS script → build** button after
> **Run NPM Install**. If that install omits devDependencies and the build fails,
> run the commands above from **Terminal** instead.

---

## 5. Start / restart

Click **Restart** in the Setup Node.js App panel. Passenger runs `server.js`;
visit your domain to confirm.

Quick server-side check (from the virtualenv terminal):

```bash
PORT=3077 node server.js &      # "> Impeccabyte is ready (listening on 3077)"
curl -I http://localhost:3077/  # expect HTTP/1.1 200
kill %1
```

---

## 6. Redeploying after a change

1. Pull the new code (Git Version Control **Update from Remote**, or re-upload).
2. `npm install --include=dev && npm run build` (only need install if deps changed).
3. **Restart** the app.

---

## 7. (Optional) Serve static assets via Apache

By default all requests, including `/_next/static/*` and `/public/*`, flow
through Node. For a marketing site this is fine. To let Apache serve the
immutable static assets directly, add rules **above** the Passenger block in the
docroot `.htaccess` (advanced; test carefully, as cPanel rewrites this file when
the app is modified).

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| 503 / "Passenger" error page | App failed to boot — check the app's stderr log (panel → **Show log**, or `~/.nodevenv/**/passenger.log`). Usually a missing build or wrong Node version. |
| Build fails: `Cannot find module 'tailwindcss'` / `typescript` | devDependencies weren't installed — run `npm install --include=dev`. |
| Build fails downloading fonts | The server blocked outbound HTTPS; allow it for the build, or build locally and upload `.next/`. |
| `next/image` optimization errors | Install sharp in the virtualenv: `npm install sharp`. |
| Styles missing / 404s on `/_next/*` | The app wasn't rebuilt after deploy, or was restarted before `npm run build` finished. Rebuild, then restart. |
| Wrong URLs in social previews | Update `metadataBase` in `app/layout.tsx` to the live domain and rebuild. |
