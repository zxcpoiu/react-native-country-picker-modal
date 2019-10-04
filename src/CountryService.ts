import {
  CountryCode,
  Country,
  TranslationLanguageCode,
  TranslationLanguageCodeMap,
  FlagType,
  CountryCodeList
} from './types'
import Fuse from 'fuse.js'

interface DataCountry {
  emojiCountries?: { [key in CountryCode]: Country }
  imageCountries?: { [key in CountryCode]: Country }
}
const localData: DataCountry = {
  emojiCountries: undefined,
  imageCountries: undefined
}

export const loadData = ((data: DataCountry) => (
  dataType: FlagType = FlagType.EMOJI
) => {
  switch (dataType) {
    case FlagType.FLAT:
      if (!data.imageCountries) {
        data.imageCountries = require('./assets/data/countries-image.json')
      }
      return data.imageCountries
    default:
      if (!data.emojiCountries) {
        data.emojiCountries = require('./assets/data/countries-emoji.json')
      }
      return data.emojiCountries
  }
})(localData)

export const getEmojiFlag = (countryCode: CountryCode) => {
  const countries = loadData()
  if (!countries) {
    throw new Error('Unable to find emoji because emojiCountries is undefined')
  }
  return countries[countryCode].flag
}

export const getImageFlag = (countryCode: CountryCode) => {
  const countries = loadData(FlagType.FLAT)
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  return countries[countryCode].flag
}

export const getCountryName = (
  countryCode: CountryCode,
  translation: TranslationLanguageCode = 'common'
) => {
  const countries = loadData()
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  return (countries[countryCode].name as TranslationLanguageCodeMap)[
    translation
  ]
}

export const getCountriesAsync = (
  flagType: FlagType,
  translation: TranslationLanguageCode = 'common'
): Country[] => {
  const countriesRaw = loadData(flagType)
  if (!countriesRaw) {
    return []
  }
  const countries = CountryCodeList.map((cca2: CountryCode) => ({
    cca2,
    ...{
      ...countriesRaw[cca2],
      name: (countriesRaw[cca2].name as TranslationLanguageCodeMap)[translation]
    }
  }))

  return countries
}

const DEFAULT_FUSE_OPTION = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['name', 'callingCode'],
  id: 'cca2'
}
let fuse: Fuse<Country>
export const search = (
  filter: string = '',
  data: Country[] = [],
  options: Fuse.FuseOptions<any> = DEFAULT_FUSE_OPTION
) => {
  if (!fuse) {
    fuse = new Fuse<Country>(data, options)
  }
  if (filter && filter !== '') {
    return fuse.search(filter)
  } else {
    return data
  }
}
