import {
  CountryCode,
  Country,
  TranslationLanguageCode,
  TranslationLanguageCodeMap,
  FlagType,
  CountryCodeList,
  Region,
  Subregion
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

export const getEmojiFlag = (countryCode: CountryCode = 'FR') => {
  const countries = loadData()
  if (!countries) {
    throw new Error('Unable to find emoji because emojiCountries is undefined')
  }
  return countries[countryCode].flag
}

export const getImageFlag = (countryCode: CountryCode = 'FR') => {
  const countries = loadData(FlagType.FLAT)
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  return countries[countryCode].flag
}

export const getCountryName = (
  countryCode: CountryCode = 'FR',
  translation: TranslationLanguageCode = 'common'
) => {
  const countries = loadData()
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }

  return countries[countryCode].name
    ? (countries[countryCode].name as TranslationLanguageCodeMap)[translation]
    : (countries[countryCode].name as TranslationLanguageCodeMap)['common']
}

export const getCountryCallingCode = (countryCode: CountryCode) => {
  const countries = loadData()
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  return countries[countryCode].callingCode[0]
}

export const getCountryCurrency = (countryCode: CountryCode) => {
  const countries = loadData()
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  return countries[countryCode].currency[0]
}

export const getCountry = (countryCode: CountryCode) => {
  const countries = loadData()
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  return countries[countryCode].callingCode[0]
}

const isCountryPresent = (countries: { [key in CountryCode]: Country }) => (
  countryCode: CountryCode
) => !!countries[countryCode]

const isRegion = (region?: Region) => (country: Country) =>
  region ? country.region === region : true

const isSubregion = (subregion?: Subregion) => (country: Country) =>
  subregion ? country.subregion === subregion : true

export const getCountries = (
  flagType: FlagType,
  translation: TranslationLanguageCode = 'common',
  region?: Region,
  subregion?: Subregion
): Country[] => {
  const countriesRaw = loadData(flagType)
  if (!countriesRaw) {
    return []
  }
  const countries = CountryCodeList.filter(isCountryPresent(countriesRaw))
    .map((cca2: CountryCode) => ({
      cca2,
      ...{
        ...countriesRaw[cca2],
        name:
          (countriesRaw[cca2].name as TranslationLanguageCodeMap)[
            translation
          ] || (countriesRaw[cca2].name as TranslationLanguageCodeMap)['common']
      }
    }))
    .filter(isRegion(region))
    .filter(isSubregion(subregion))
    .sort((country1: Country, country2: Country) =>
      (country1.name as string).localeCompare(country2.name as string)
    )

  return countries
}

const DEFAULT_FUSE_OPTION = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['name', 'callingCode']
}
let fuse: Fuse<Country>
export const search = (
  filter: string = '',
  data: Country[] = [],
  options: Fuse.FuseOptions<any> = DEFAULT_FUSE_OPTION
) => {
  if (data.length === 0) {
    return []
  }
  if (!fuse) {
    fuse = new Fuse<Country>(data, options)
  }
  if (filter && filter !== '') {
    const result = fuse.search(filter)
    return result
  } else {
    return data
  }
}
const uniq = (arr: any[]) => Array.from(new Set(arr))

export const getLetters = (countries: Country[]) => {
  return uniq(
    countries
      .map((country: Country) =>
        (country.name as string).substr(0, 1).toLocaleUpperCase()
      )
      .sort((l1: string, l2: string) => l1.localeCompare(l2))
  )
}
