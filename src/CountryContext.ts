import * as React from 'react'
import { TranslationLanguageCode } from './types'
import {
  getEmojiFlag,
  getImageFlag,
  getCountryName,
  getCountries,
  getLetters,
  search
} from './CountryService'

export interface CountryContextParam {
  translation?: TranslationLanguageCode
  getCountryName: typeof getCountryName
  getImageFlag: typeof getImageFlag
  getEmojiFlag: typeof getEmojiFlag
  getCountries: typeof getCountries
  search: typeof search
  getLetters: typeof getLetters
}
export const DEFAULT_COUNTRY_CONTEXT = {
  translation: 'common' as TranslationLanguageCode,
  getCountryName,
  getImageFlag,
  getEmojiFlag,
  getCountries,
  search,
  getLetters
}
export const CountryContext = React.createContext<CountryContextParam>(
  DEFAULT_COUNTRY_CONTEXT
)

export const useContext = () => React.useContext(CountryContext)

export const {
  Provider: CountryProvider,
  Consumer: CountryConsumer
} = CountryContext
