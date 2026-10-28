import projects from './projects.json';

/**
 * Проекты — карточки на главной, без отдельных страниц.
 * Порядок в JSON — порядок на странице.
 *
 * Все ключи обязательны: пустая строка или пустой массив означают
 * «не заполнено» и просто не рендерятся. Так тип остаётся одним,
 * а не объединением вариантов с разным набором полей.
 */
export type Project = (typeof projects)[number];
export type ProjectLink = Project['links'][number];

export default projects as Project[];
