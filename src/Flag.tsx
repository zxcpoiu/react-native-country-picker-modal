import React, { memo } from 'react'
import { Emoji } from './Emoji'
import { CountryCode } from './types'
import { useTheme } from './CountryTheme'
import { useContext } from './CountryContext'
import {
  Image,
  StyleSheet,
  PixelRatio,
  Text,
  View,
  Platform
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    marginRight: 10
  },
  emojiFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Platform.select({ android: 20, default: 30 }),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  },
  imageFlag: {
    resizeMode: 'contain',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    opacity: 0.8
  }
})

interface FlagType {
  countryCode: CountryCode
  withEmoji?: boolean
  withFlagButton?: boolean
}

const ImageFlag = memo(({ countryCode }: FlagType) => {
  const { primaryColorVariant } = useTheme()
  const { getImageFlag } = useContext()

  return (
    <Image
      resizeMode={'contain'}
      style={[styles.imageFlag, { borderColor: primaryColorVariant }]}
      source={{ uri: getImageFlag(countryCode) }}
    />
  )
})

const EmojiFlag = memo(({ countryCode }: FlagType) => {
  const { getEmojiFlag } = useContext()

  return (
    <Text style={styles.emojiFlag} allowFontScaling={false}>
      <Emoji name={getEmojiFlag(countryCode)} />
    </Text>
  )
})

export const Flag = ({ countryCode, withEmoji, withFlagButton }: FlagType) =>
  withFlagButton ? (
    <View style={styles.container}>
      {withEmoji ? (
        <EmojiFlag {...{ countryCode }} />
      ) : (
        <ImageFlag {...{ countryCode }} />
      )}
    </View>
  ) : null

Flag.defaultProps = {
  withEmoji: true
}
