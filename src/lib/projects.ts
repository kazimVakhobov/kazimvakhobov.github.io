import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from '../i18n/ui';

export type ProjectEntry = CollectionEntry<'projects'>;

export type Project = {
  slug: string;
  /** язык, на котором реально отдаётся контент (может быть фолбэком) */
  lang: Lang;
  /** true, если перевода на запрошенный язык нет и показывается en */
  isFallback: boolean;
  entry: ProjectEntry;
};

/** "my-cli/ru" → "my-cli" */
export function slugOf(entry: ProjectEntry): string {
  return entry.id.split('/')[0];
}

const isPublished = (entry: ProjectEntry) =>
  import.meta.env.DEV || entry.data.draft !== true;

/**
 * Проекты для языка. Если перевода нет — подставляется английская версия,
 * чтобы ссылка /ru/projects/<slug>/ не вела в 404.
 */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = (await getCollection('projects')).filter(isPublished);

  const bySlug = new Map<string, Map<Lang, ProjectEntry>>();
  for (const entry of all) {
    const slug = slugOf(entry);
    if (!bySlug.has(slug)) bySlug.set(slug, new Map());
    bySlug.get(slug)!.set(entry.data.lang, entry);
  }

  const projects: Project[] = [];
  for (const [slug, versions] of bySlug) {
    const exact = versions.get(lang);
    const entry = exact ?? versions.get(defaultLang) ?? [...versions.values()][0];
    if (!entry) continue;
    projects.push({
      slug,
      lang: entry.data.lang,
      isFallback: !exact,
      entry,
    });
  }

  return projects.sort(
    (a, b) =>
      Number(b.entry.data.featured) - Number(a.entry.data.featured) ||
      a.entry.data.order - b.entry.data.order ||
      a.entry.data.title.localeCompare(b.entry.data.title)
  );
}

export async function getProject(slug: string, lang: Lang): Promise<Project | undefined> {
  const projects = await getProjects(lang);
  return projects.find((p) => p.slug === slug);
}

/** Предыдущий / следующий — для навигации в подвале страницы проекта. */
export function neighbours(projects: Project[], slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}

/** Уникальные теги по всем проектам — для фильтра на /projects/. */
export function allTags(projects: Project[]): string[] {
  const tags = new Set<string>();
  for (const p of projects) p.entry.data.tags.forEach((t) => tags.add(t));
  return [...tags].sort((a, b) => a.localeCompare(b));
}
