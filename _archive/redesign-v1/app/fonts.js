import { Tektur, Reem_Kufi, Readex_Pro } from 'next/font/google';

// Display (Latin): Tektur — squared, extended letterforms that echo the JOE13 wordmark.
// Variable on both wght and wdth so headlines can "breathe" under the pointer.
export const fontDisplay = Tektur({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
  display: 'swap',
  variable: '--j13-font-display-latin',
});

// Display (Arabic): Reem Kufi — geometric Kufi, the Arabic counterpart of Tektur's grid.
export const fontDisplayArabic = Reem_Kufi({
  subsets: ['arabic', 'latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--j13-font-display-arabic',
});

// Text (both scripts): Readex Pro — one family for Latin and Arabic body copy.
export const fontText = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--j13-font-text',
});

export const fontVariables = [
  fontDisplay.variable,
  fontDisplayArabic.variable,
  fontText.variable,
].join(' ');
