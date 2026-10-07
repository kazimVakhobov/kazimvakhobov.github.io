import en from './en.json';
import ru from './ru.json';
import uz from './uz.json';

export const languages = {
  en: 'English',
  ru: 'Русский',
  uz: "O'zbekcha",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];

/** Словари. en — полный, он же источник фолбэка для незаполненных ключей. */
export const dictionaries = { en, ru, uz } as const;

/** Тип словаря берём из английского: он эталонный. */
export type Dict = typeof en;

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (langs as string[]).includes(value);
}

/** Язык из URL: /ru/… → 'ru', / → 'en'. */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  return isLang(maybeLang) ? maybeLang : defaultLang;
}

/**
 * Словарь для языка. Там, где перевод ещё не заполнен, подставляется английский,
 * так что недопереведённая страница остаётся читаемой, а не пустой.
 */
export function useTranslations(lang: Lang): Dict {
  return mergeDeep(dictionaries[defaultLang], dictionaries[lang]) as Dict;
}

/**
 * Локализованный путь: localizePath('/projects/', 'ru') → '/ru/projects/'.
 * Для языка по умолчанию префикс не добавляется (prefixDefaultLocale: false).
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = `/${path.replace(/^\/+/, '')}`;
  return lang === defaultLang ? clean : `/${lang}${clean === '/' ? '/' : clean}`;
}

/** Сколько места занимает подпись языка в переключателе. */
export const langLabels: Record<Lang, string> = {
  en: 'EN',
  ru: 'RU',
  uz: 'UZ',
};

type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Рекурсивное слияние: пустые строки/массивы в переводе считаются «не заполнено». */
function mergeDeep(base: unknown, override: unknown): unknown {
  if (override === undefined || override === null) return base;
  if (typeof override === 'string') return override.trim() === '' ? base : override;
  if (Array.isArray(override)) return override.length === 0 ? base : override;

  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Plain = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = mergeDeep(base[key], override[key]);
    }
    return out;
  }
  return override;
}
