import { getCollection, type CollectionEntry } from 'astro:content';

/** Запись коллекции = проект. id файла («detent») и есть slug в URL. */
export type Project = CollectionEntry<'projects'>;

const isPublished = (project: Project) =>
  import.meta.env.DEV || project.data.draft !== true;

/** Черновики видны только в `astro dev`, в сборку не попадают. */
export async function getProjects(): Promise<Project[]> {
  const projects = (await getCollection('projects')).filter(isPublished);

  return projects.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      a.data.order - b.data.order ||
      a.data.title.localeCompare(b.data.title)
  );
}

/** Предыдущий / следующий — для навигации в подвале страницы проекта. */
export function neighbours(projects: Project[], slug: string) {
  const i = projects.findIndex((p) => p.id === slug);
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}

/** Уникальные теги по всем проектам — для фильтра на /projects/. */
export function allTags(projects: Project[]): string[] {
  const tags = new Set<string>();
  for (const p of projects) p.data.tags.forEach((t) => tags.add(t));
  return [...tags].sort((a, b) => a.localeCompare(b));
}
