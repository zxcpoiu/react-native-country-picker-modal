import { createTheming } from '@callstack/react-theme-provider'
import { Platform } from 'react-native'
import { getHeightPercent } from './ratio'

export const DEFAULT_THEME = {
  primaryColor: '#ccc',
  primaryColorVariant: '#eee',
  backgroundColor: '#ffffff',
  onBackgroundTextColor: '#000000',
  fontSize: 16,
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: 'Arial'
  }),
  filterPlaceholderTextColor: '#aaa',
  activeOpacity: 0.5,
  itemHeight: getHeightPercent(7)
}
export type Theme = Partial<typeof DEFAULT_THEME>

const { ThemeProvider, useTheme } = createTheming<Theme>(DEFAULT_THEME)

export { ThemeProvider, useTheme }
