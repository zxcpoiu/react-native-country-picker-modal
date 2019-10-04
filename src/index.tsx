import React, { ReactNode } from 'react'
import { FlagButton } from './FlagButton'
import { TranslationLanguageCode, CountryCode, Country } from './types'
import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from './CountryContext'
import { ThemeProvider, DEFAULT_THEME, Theme } from './CountryTheme'
import { CountryFilter } from './CountryFilter'
import { ModalProps } from 'react-native'
import { CountryPicker } from './CountryPicker'

interface Props {
  countryCode: CountryCode
  theme?: Theme
  translation?: TranslationLanguageCode
  modalProps?: ModalProps
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withEmoji?: boolean
  withCountryName?: boolean
  withFilter?: boolean
  withFlag?: boolean
  visible?: boolean
  renderFlagButton?(props: FlagButton['props']): ReactNode
  renderCountryFilter?(props: CountryFilter['props']): ReactNode
  onSelect(country: Country): void
}

export default function main({ theme, translation, ...props }: Props) {
  return (
    <ThemeProvider theme={{ ...DEFAULT_THEME, ...theme }}>
      <CountryProvider value={{ ...DEFAULT_COUNTRY_CONTEXT, translation }}>
        <CountryPicker {...props} />
      </CountryProvider>
    </ThemeProvider>
  )
}

main.defaultProps = {
  onSelect: () => {}
}
