# portfolio

Personal portfolio and website of Kazim Vakhobov — Senior Frontend Engineer.

Built with [Astro](https://astro.build). Static output, English only,
one page.

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

### 2. Projects — `src/data/projects.json`

Projects are cards in the `Projects` section of the home page; there are no
separate project pages. One object per project, and the order in the file is the
order on the page:

```json
{
  "id": "my-cli",
  "kicker": "Open source · developer tooling",
  "title": "my-cli",
  "description": "One or two sentences: what it does and why it exists.",
  "tags": ["Node.js", "CLI"],
  "links": [
    { "label": "Source code", "href": "https://github.com/…", "icon": "github" },
    { "label": "Website", "href": "https://…", "icon": "external" }
  ]
}
```

Every key is required — leave a string empty or an array empty when there is
nothing to show, and it simply is not rendered. `icon` is a name from
`src/components/Icon.astro` (`github`, `external`, `play`, `docs`, `npm`, …);
an unknown name falls back to the external-link icon.

## Routing

The site is one page, `/`, plus a `404`. Nav items are anchors into the sections
of the home page. The sitemap is generated automatically.

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
