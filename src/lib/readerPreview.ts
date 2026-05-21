import type { CSSProperties } from 'react'

export type ReaderTheme = 'light' | 'dark' | 'sepia' | 'oled'
export type ReaderFlow = 'paginated' | 'continuous'
export type ReaderSpread = 'single' | 'double'
export type ReaderAlign = 'left' | 'justify'

export type ReaderSettings = {
  fontFamily: string
  fontSize: number
  margin: number
  lineHeight: number
  paragraphSpacing: number
  theme: ReaderTheme
  textAlign: ReaderAlign
  flow: ReaderFlow
  spread: ReaderSpread
}

type ReaderStyle = CSSProperties & {
  '--reader-font-size': string
  '--reader-margin': string
  '--reader-line-height': string
  '--reader-paragraph-spacing': string
}

const themes: Record<
  ReaderTheme,
  { label: string; backgroundColor: string; color: string }
> = {
  light: { label: 'Claro', backgroundColor: '#fffdf8', color: '#24201a' },
  dark: { label: 'Escuro', backgroundColor: '#2a251f', color: '#eee4d1' },
  sepia: { label: 'Sepia', backgroundColor: '#f4ecd9', color: '#332715' },
  oled: { label: 'OLED', backgroundColor: '#000000', color: '#f7f3ea' },
}

export const defaultReaderSettings: ReaderSettings = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 18,
  margin: 32,
  lineHeight: 1.6,
  paragraphSpacing: 0.8,
  theme: 'sepia',
  textAlign: 'left',
  flow: 'paginated',
  spread: 'single',
}

export function normalizeReaderSettings(
  settings: ReaderSettings,
): ReaderSettings {
  return {
    ...settings,
    spread: settings.flow === 'continuous' ? 'single' : settings.spread,
  }
}

export function getReaderPreviewState(settings: ReaderSettings) {
  const normalizedSettings = normalizeReaderSettings(settings)
  const theme = themes[normalizedSettings.theme]

  return {
    normalizedSettings,
    readerStyle: {
      '--reader-font-size': `${normalizedSettings.fontSize}px`,
      '--reader-margin': `${normalizedSettings.margin}px`,
      '--reader-line-height': normalizedSettings.lineHeight.toFixed(2),
      '--reader-paragraph-spacing': `${normalizedSettings.paragraphSpacing.toFixed(2)}em`,
      backgroundColor: theme.backgroundColor,
      color: theme.color,
      fontFamily: normalizedSettings.fontFamily,
      textAlign: normalizedSettings.textAlign,
    } satisfies ReaderStyle,
  }
}
