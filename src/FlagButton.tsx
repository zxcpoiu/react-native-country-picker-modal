import React, { memo, useState, useEffect, ReactNode } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  StyleProp,
  ViewStyle,
  TextProps,
} from 'react-native'
import { CountryCode } from './types'
import { Flag } from './Flag'
import { useContext } from './CountryContext'
import { CountryText } from './CountryText'
import { useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  containerWithEmoji: {
    marginTop: 0,
  },
  containerWithoutEmoji: {
    marginTop: 5,
  },
  flagWithSomethingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  something: { fontSize: 16 },
})

type FlagWithSomethingProp = Pick<
  FlagButtonProps,
  | 'countryCode'
  | 'withEmoji'
  | 'withCountryNameButton'
  | 'withCurrencyButton'
  | 'withCallingCodeButton'
  | 'withFlagButton'
> & { flagSize: number }

const FlagText = (props: TextProps & { children: ReactNode }) => (
  <CountryText {...props} style={styles.something} />
)

const FlagWithSomething = memo(
  ({
    countryCode,
    withEmoji,
    withCountryNameButton,
    withCurrencyButton,
    withCallingCodeButton,
    withFlagButton,
    flagSize,
  }: FlagWithSomethingProp) => {
    const {
      translation,
      getCountryNameAsync,
      getCountryCurrencyAsync,
      getCountryCallingCodeAsync,
    } = useContext()
    const [state, setState] = useState({
      countryName: '',
      currency: '',
      callingCode: '',
    })
    const { countryName, currency, callingCode } = state
    useEffect(() => {
      if (withCountryNameButton) {
        getCountryNameAsync(countryCode, translation)
          .then((countryName: string) => setState({ ...state, countryName }))
          .catch(console.warn)
      }

      if (withCurrencyButton) {
        getCountryCurrencyAsync(countryCode)
          .then((currency: string) => setState({ ...state, currency }))
          .catch(console.warn)
      }

      if (withCallingCodeButton) {
        getCountryCallingCodeAsync(countryCode)
          .then((callingCode: string) => setState({ ...state, callingCode }))
          .catch(console.warn)
      }
    }, [withCountryNameButton, withCurrencyButton, withCallingCodeButton])

    return (
      <View style={styles.flagWithSomethingContainer}>
        <Flag
          {...{ withEmoji, countryCode, withFlagButton, flagSize: flagSize! }}
        />
        {countryName ? <FlagText>{countryName + ' '}</FlagText> : null}
        {currency ? <FlagText>{`(${currency}) `}</FlagText> : null}
        {callingCode ? <FlagText>{`+${callingCode}`}</FlagText> : null}
      </View>
    )
  },
)

interface FlagButtonProps {
  withEmoji?: boolean
  withCountryNameButton?: boolean
  withCurrencyButton?: boolean
  withCallingCodeButton?: boolean
  withFlagButton?: boolean
  containerButtonStyle?: StyleProp<ViewStyle>
  countryCode: CountryCode
  onOpen?(): void
}

export const FlagButton = ({
  withEmoji,
  withCountryNameButton,
  withCallingCodeButton,
  withCurrencyButton,
  withFlagButton,
  countryCode,
  containerButtonStyle,
  onOpen,
}: FlagButtonProps) => {
  const withSomething =
    withCountryNameButton || withCallingCodeButton || withCurrencyButton
  const { flagSizeButton: flagSize } = useTheme()
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onOpen}>
      <View
        style={[
          styles.container,
          withEmoji ? styles.containerWithEmoji : styles.containerWithoutEmoji,
          containerButtonStyle,
        ]}
      >
        {withSomething ? (
          <FlagWithSomething
            {...{
              countryCode,
              withEmoji,
              withCountryNameButton,
              withCallingCodeButton,
              withCurrencyButton,
              withFlagButton,
              flagSize: flagSize!,
            }}
          />
        ) : (
          <Flag
            {...{ countryCode, withEmoji, withFlagButton, flagSize: flagSize! }}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

FlagButton.defaultProps = {
  withEmoji: Platform.OS === 'ios',
  withCountryNameButton: false,
  withCallingCodeButton: false,
  withCurrencyButton: false,
  withFlagButton: true,
}
