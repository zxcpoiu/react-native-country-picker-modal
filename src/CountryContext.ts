import * as React from 'react'
import { TranslationLanguageCode } from './types'
import {
  getEmojiFlagAsync,
  getImageFlagAsync,
  getCountryNameAsync,
  getCountriesAsync,
  getLetters,
  getCountryCallingCodeAsync,
  getCountryCurrencyAsync,
  search
} from './CountryService'

export interface CountryContextParam {
  translation?: TranslationLanguageCode
  getCountryNameAsync: typeof getCountryNameAsync
  getImageFlagAsync: typeof getImageFlagAsync
  getEmojiFlagAsync: typeof getEmojiFlagAsync
  getCountriesAsync: typeof getCountriesAsync
  getLetters: typeof getLetters
  getCountryCallingCodeAsync: typeof getCountryCallingCodeAsync
  getCountryCurrencyAsync: typeof getCountryCurrencyAsync
  search: typeof search
}
export const DEFAULT_COUNTRY_CONTEXT = {
  translation: 'common' as TranslationLanguageCode,
  getCountryNameAsync,
  getImageFlagAsync,
  getEmojiFlagAsync,
  getCountriesAsync,
  getCountryCallingCodeAsync,
  getCountryCurrencyAsync,
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
