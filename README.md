# portfolio

Personal portfolio and website of Kazim Vakhobov — Senior Frontend Engineer.

Built with [Astro](https://astro.build). Static output, three languages (en / ru / uz),
separate case study pages for open source projects.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # type check
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
```

## Content

Everything editable lives in two places.

### 1. Resume and interface text — `src/i18n/`

| File | Purpose |
| --- | --- |
| `en.json` | reference dictionary, all keys present |
| `ru.json` | Russian |
| `uz.json` | Uzbek (Latin) |

English is the fallback: an empty string or empty array in `ru.json` / `uz.json` is
replaced by the English value, so a half-translated page still reads fine.

Array sections (`experience.items`, `skills.groups`, …) contain one empty template
entry in `en.json` — copy it and fill in. Entries whose main field is still empty are
not rendered, so blank templates stay invisible on the site.

### 2. Project case studies — `src/content/projects/`

One folder per project, one Markdown file per language:

```
src/content/projects/
└─ my-cli/
   ├─ en.md
   ├─ ru.md
   └─ uz.md
```

The folder name becomes the URL: `/projects/my-cli/`, `/ru/projects/my-cli/`.

- **Frontmatter** — structured data: badges, links, tech stack, metrics, media.
  Schema is in `src/content.config.ts`, so a typo fails the build instead of the page.
- **Markdown body** — free-form presentation: problem, solution, features,
  architecture, code samples, screenshots.

`src/content/projects/example-project/` is a filled template. Copy it:

```bash
cp -r src/content/projects/example-project src/content/projects/my-cli
```

Set `draft: false` when the page is ready. Drafts are visible in `npm run dev`
and excluded from the build. If a language file is missing, that language falls
back to `en.md` and shows a small notice.

## Routing

| URL | Language |
| --- | --- |
| `/`, `/projects/`, `/projects/<slug>/` | English (default, no prefix) |
| `/ru/…` | Russian |
| `/uz/…` | Uzbek |

Pages under `src/pages/` are thin wrappers; the actual markup is in `src/views/`,
so all three languages share one implementation.

`hreflang` alternates and the sitemap are generated automatically.

## Deploy

Static output — any static host works. Recommended: **Cloudflare Pages**
(free, unlimited bandwidth, apex domain support).

1. Push the repository to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command `npm run build`, output directory `dist`, Node version 22.
4. Custom domains → add `kazimvakhobov.com` and `www.kazimvakhobov.com`.
   If the domain's DNS is on Cloudflare, the apex record is created automatically;
   otherwise point the apex at the Pages target and `www` at a CNAME.

Alternatives, same output:

- **Netlify** — build `npm run build`, publish `dist`, custom domains on the free plan.
- **GitHub Pages** — needs a workflow with `withastro/action`; apex domain via A records
  to GitHub's IPs plus a `CNAME` file in `public/`.
- **Own VPS** — `npm run build`, copy `dist/` to the server, serve it with nginx:

  ```nginx
  server {
      server_name kazimvakhobov.com;
      root /var/www/portfolio;
      index index.html;
      location / {
          try_files $uri $uri/ $uri/index.html =404;
      }
      error_page 404 /404.html;
  }
  ```

The site URL is set in `astro.config.mjs` (`site`). It is used for canonical links,
`hreflang` and the sitemap — update it if the domain changes.
