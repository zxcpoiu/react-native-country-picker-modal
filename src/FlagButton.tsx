import React, { memo } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Platform
} from 'react-native'
import { CountryCode } from './types'
import { Flag } from './Flag'
import { useContext } from './CountryContext'

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  containerWithEmoji: {
    marginTop: 0
  },
  containerWithoutEmoji: {
    marginTop: 5
  },
  flagWithNameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  name: { fontSize: 16 }
})

const FlagWithName = memo(
  ({
    countryCode,
    withEmoji
  }: Pick<FlagButtonProps, 'countryCode' | 'withEmoji'>) => {
    const { translation, getCountryName } = useContext()
    const countryName = getCountryName(countryCode, translation)
    return (
      <View style={styles.flagWithNameContainer}>
        <Flag {...{ withEmoji, countryCode }} />
        <Text style={styles.name}>{countryName}</Text>
      </View>
    )
  }
)

interface FlagButtonProps {
  withEmoji?: boolean
  withCountryName?: boolean
  countryCode: CountryCode
  onOpen?(): void
}

export const FlagButton = ({
  withEmoji,
  withCountryName,
  countryCode,
  onOpen
}: FlagButtonProps) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onOpen}>
    <View
      style={[
        styles.container,
        withEmoji ? styles.containerWithEmoji : styles.containerWithoutEmoji
      ]}
    >
      {withCountryName ? (
        <FlagWithName {...{ countryCode, withEmoji }} />
      ) : (
        <Flag {...{ countryCode, withEmoji }} />
      )}
    </View>
  </TouchableOpacity>
)

FlagButton.defaultProps = {
  withEmoji: Platform.OS === 'ios',
  withCountryName: false
}
