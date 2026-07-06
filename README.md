# Two Years of Us 💕

A private, romantic mini web page for your two-year anniversary — hosted on GitHub Pages with an email + secret gate so only you and your girlfriend can unlock it.

## Quick start

### 1. Customize the content

Edit **`content.js`** with your names, anniversary date, love letter, timeline, and photo filenames.

### 2. Set up local access (for preview)

```bash
cp secrets.example.js secrets.js
```

Edit `secrets.js` with your two emails and a shared passphrase. This file is gitignored and never pushed.

### 3. Preview locally

Open `index.html` in your browser, or:

```bash
npx serve .
```

### 4. Create the GitHub repo & push

Create a new repo at [github.com/new](https://github.com/new) (e.g. `anniversary`), then:

```bash
cd e:\Projects\Anniversary
git init
git add .
git commit -m "Initial commit: two-year anniversary page"
git branch -M main
git remote add origin https://github.com/Kavalieros/anniversary.git
git push -u origin main
```

### 5. Add GitHub Secrets (for the live site)

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `EMAIL_1` | Your email address |
| `EMAIL_2` | Her email address |
| `PASSPHRASE` | A shared secret only you two know |

The deploy workflow generates `secrets.js` from these at build time — your passphrase never gets committed.

### 6. Enable GitHub Pages

1. **Settings → Pages**
2. **Source:** GitHub Actions
3. Push to `main` (or re-run the workflow under Actions)
4. Live at: `https://kavalieros.github.io/anniversary/`

## How access control works

GitHub Pages URLs are always reachable on the internet. This page adds a **login gate**:

1. Enter an **email** — must match one of your two allowed addresses
2. Enter your **shared secret** — an inside joke, song lyric, anniversary date, etc.
3. The page unlocks for that browser session

This is ideal for a personal romantic page. Anyone who stumbles on the URL still needs both the email and the secret.

### Privacy tips

- Use an **obscure repo name** (e.g. `our-july-memories` instead of `anniversary`)
- Don't share the link publicly
- `noindex` is already set so search engines skip the page

## Adding photos

1. Add images to `assets/photos/`
2. List filenames in the `photos` array in `content.js`
3. Commit and push

## Project structure

```
├── index.html              # Page + login gate
├── content.js              # Names, letter, timeline (committed)
├── secrets.example.js      # Template for local dev
├── secrets.js              # Your emails + passphrase (gitignored)
├── css/style.css
├── js/
│   ├── config.js           # Merges content + secrets
│   ├── auth.js             # Login gate
│   └── app.js              # Counters, timeline, gallery
└── .github/workflows/      # Auto-deploy to GitHub Pages
```

---

Happy anniversary! ♥
