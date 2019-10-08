import React, { ReactNode, useState, useEffect } from 'react'
import { ModalProps, FlatListProps } from 'react-native'
import { CountryModal } from './CountryModal'
import { HeaderModal } from './HeaderModal'
import { Country, CountryCode, FlagType } from './types'
import { CountryFilter, CountryFilterProps } from './CountryFilter'
import { FlagButton } from './FlagButton'
import { useContext } from './CountryContext'
import { CountryList } from './CountryList'

interface State {
  visible: boolean
  countries: Country[]
  filter?: string
}

const renderFlagButton = (
  props: FlagButton['props'] & CountryPickerProps['renderFlagButton']
): ReactNode =>
  props.renderFlagButton ? (
    props.renderFlagButton(props)
  ) : (
    <FlagButton {...props} />
  )

const renderFilter = (
  props: CountryFilter['props'] & CountryPickerProps['renderCountryFilter']
): ReactNode =>
  props.renderCountryFilter ? (
    props.renderCountryFilter(props)
  ) : (
    <CountryFilter {...props} />
  )

interface CountryPickerProps {
  countryCode: CountryCode
  modalProps?: ModalProps
  filterProps?: CountryFilterProps
  flatListProps?: FlatListProps<Country>
  withEmoji?: boolean
  withCountryName?: boolean
  withFilter?: boolean
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean
  withFlag?: boolean
  withModal?: boolean
  visible?: boolean
  renderFlagButton?(props: FlagButton['props']): ReactNode
  renderCountryFilter?(props: CountryFilter['props']): ReactNode
  onSelect(country: Country): void
}

export const CountryPicker = (props: CountryPickerProps) => {
  const {
    countryCode,
    renderFlagButton: renderButton,
    renderCountryFilter,
    filterProps,
    modalProps,
    flatListProps,
    onSelect,
    withEmoji,
    withFilter,
    withCountryName,
    withAlphaFilter,
    withCallingCode,
    withCurrency,
    withFlag,
    withModal
  } = props
  const [state, setState] = useState<State>({
    visible: props.visible || false,
    countries: [],
    filter: ''
  })
  const { translation, getCountries } = useContext()
  const { visible, filter, countries } = state
  const onOpen = () => setState({ ...state, visible: true })
  const onClose = () => setState({ ...state, filter: '', visible: false })
  const setFilter = (filter: string) => setState({ ...state, filter })
  const setCountries = (countries: Country[]) =>
    setState({ ...state, countries })
  const onSelectClose = (country: Country) => {
    onSelect(country)
    onClose()
  }
  const flagProp = {
    withEmoji,
    withCountryName,
    countryCode,
    renderFlagButton: renderButton,
    onOpen
  }
  useEffect(() => {
    const countries = getCountries(
      withEmoji ? FlagType.EMOJI : FlagType.FLAT,
      translation
    )
    setCountries(countries)
  }, [translation, withEmoji])

  return (
    <>
      {renderFlagButton(flagProp)}
      <CountryModal
        {...{ ...modalProps, visible, withModal }}
        onRequestClose={onClose}
      >
        <HeaderModal
          {...{ withFilter, onClose }}
          renderFilter={(props: CountryFilter['props']) =>
            renderFilter({
              ...props,
              renderCountryFilter,
              onChangeText: setFilter,
              value: filter,
              ...filterProps
            })
          }
        />
        <CountryList
          {...{
            onSelect: onSelectClose,
            data: countries,
            letters: [],
            withAlphaFilter: withAlphaFilter && filter === '',
            withCallingCode,
            withCurrency,
            withFlag,
            withEmoji,
            filter,
            flatListProps
          }}
        />
      </CountryModal>
    </>
  )
}

CountryPicker.defaultProps = {
  withAlphaFilter: false,
  withCallingCode: false
}
