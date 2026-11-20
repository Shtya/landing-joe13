import { Sora, Inter_Tight, Alexandria, Readex_Pro } from 'next/font/google';

/*
 * JOE13 type system.
 *   Latin display  — Sora: geometric, open and confident; variable weight
 *                    (100–800) so headings can fill in from thin on reveal.
 *   Latin text     — Inter Tight: compact, highly legible body copy.
 *   Arabic display — Alexandria: modern geometric Arabic with a weight axis; pairs with Sora.
 *   Arabic text    — Readex Pro: one variable file, excellent Arabic legibility.
 *
 * Every family is variable (one file per subset), self-hosted by next/font and
 * served with font-display: swap. Latin files are preloaded (both locales show
 * Latin: brand, numbers, tech names); the Arabic files load on the Arabic page
 * only when used, so the English page never downloads them.
 * redesign.css picks the pair per locale via [dir='rtl'].
 */

export const fontDisplay = Sora({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--j13-font-display-latin',
  adjustFontFallback: true,
});

export const fontText = Inter_Tight({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--j13-font-text-latin',
});

export const fontDisplayArabic = Alexandria({
  subsets: ['arabic'],
  weight: 'variable',
  display: 'swap',
  preload: false,
  variable: '--j13-font-display-arabic',
});

export const fontTextArabic = Readex_Pro({
  subsets: ['arabic'],
  weight: 'variable',
  display: 'swap',
  preload: false,
  variable: '--j13-font-text-arabic',
});

export const fontVariables = [
  fontDisplay.variable,
  fontText.variable,
  fontDisplayArabic.variable,
  fontTextArabic.variable,
].join(' ');
