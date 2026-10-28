# portfolio

Personal portfolio and website of Kazim Vakhobov — Senior Frontend Engineer.

Built with [Astro](https://astro.build). Static output, English only,
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

### 1. Resume and interface text — `src/data/site.json`

Every string on the site lives in this one file: metadata, navigation, sidebar,
hero, about, experience, education, skills, contact, footer. Components import it
directly (`import site from '../data/site.json'`), so there is no dictionary layer
to keep in sync.

Array sections (`experience.items`, `skills.groups`, …) can hold an empty template
entry — copy one and fill it in. Entries whose main field (`role`, `degree`, `name`,
`label`) is still empty are not rendered, so blank templates stay invisible on the site.

### 2. Project case studies — `src/content/projects/`

One Markdown file per project:

```
src/content/projects/
├─ detent.md
├─ har-kun-ai.md
└─ my-cli.md
```

The file name becomes the URL: `my-cli.md` → `/projects/my-cli/`.

- **Frontmatter** — structured data: badges, links, tech stack, metrics, media.
  Schema is in `src/content.config.ts`, so a typo fails the build instead of the page.
- **Markdown body** — free-form presentation: problem, solution, features,
  architecture, code samples, screenshots.

The existing case studies double as templates — `har-kun-ai.md` is the fullest one
(stats, media, every frontmatter field in use). Copy one and edit it:

```bash
cp src/content/projects/har-kun-ai.md src/content/projects/my-cli.md
```

New pages start as drafts: set `draft: true` while writing, flip it to `draft: false`
when the page is ready. Drafts are visible in `npm run dev` and excluded from the build.

## Routing

| URL | Page |
| --- | --- |
| `/` | home — resume on one page |
| `/projects/` | case study index with a tag filter |
| `/projects/<slug>/` | one case study |

Pages under `src/pages/` are thin wrappers; the actual markup is in `src/views/`.

The sitemap is generated automatically.

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
