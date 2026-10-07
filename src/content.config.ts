import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Проекты. Один файл = один проект на одном языке:
 *   src/content/projects/<slug>/<lang>.md   →   id: "<slug>/<lang>"
 *
 * Frontmatter — структурированная часть (бейджи, ссылки, стек, метрики),
 * тело Markdown — свободная презентация (разделы, код, картинки).
 */
const link = z.object({
  label: z.string(),
  href: z.string(),
  /** github | demo | docs | npm | external — определяет иконку */
  icon: z.string().default('external'),
  /** основная кнопка в шапке проекта */
  primary: z.boolean().default(false),
});

const media = z.object({
  /** image | video | iframe */
  type: z.enum(['image', 'video', 'iframe']).default('image'),
  src: z.string(),
  alt: z.string().default(''),
  caption: z.string().default(''),
  /** соотношение сторон, напр. "16/9" */
  ratio: z.string().default('16/9'),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      /** язык файла — дублируем явно, чтобы фильтровать коллекцию */
      lang: z.enum(['en', 'ru', 'uz']),

      title: z.string(),
      tagline: z.string().default(''),
      /** короткая подпись над заголовком: "Open source · CLI" */
      kicker: z.string().default(''),

      /** обложка для карточки и og:image */
      cover: image().optional(),
      coverAlt: z.string().default(''),

      /** порядок в списке: меньше — выше */
      order: z.number().default(100),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),

      period: z.string().default(''),
      updated: z.coerce.date().optional(),
      /** active | maintained | archived | wip */
      status: z.enum(['active', 'maintained', 'archived', 'wip']).default('active'),
      license: z.string().default(''),

      /** теги для фильтра на /projects/ */
      tags: z.array(z.string()).default([]),
      /** стек, сгруппированный по слоям */
      stack: z.array(z.object({ name: z.string(), items: z.array(z.string()) })).default([]),

      links: z.array(link).default([]),
      media: z.array(media).default([]),

      /** метрики: "12k downloads", "p95 40 ms" */
      stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),

      /** моя роль, одной-двумя фразами */
      role: z.string().default(''),
    }),
});

export const collections = { projects };
