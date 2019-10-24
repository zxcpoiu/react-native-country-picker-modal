import React, { memo, useState, useEffect } from 'react'
import { Emoji } from './Emoji'
import { CountryCode } from './types'
import { useContext } from './CountryContext'
import {
  Image,
  StyleSheet,
  PixelRatio,
  Text,
  View,
  ActivityIndicator
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
  flagSize: number
}

const ImageFlag = memo(({ countryCode, flagSize }: FlagType) => {
  const { getImageFlagAsync } = useContext()
  const [uri, setUri] = useState<string | undefined>(undefined)

  useEffect(() => {
    getImageFlagAsync(countryCode)
      .then(setUri)
      .catch(console.error)
  }, [countryCode])
  if (!uri) {
    return <ActivityIndicator size={'small'} />
  }
  return (
    <Image
      resizeMode={'contain'}
      style={[
        styles.imageFlag,
        { borderColor: 'transparent', height: flagSize }
      ]}
      source={{ uri }}
    />
  )
})

const EmojiFlag = memo(({ countryCode, flagSize }: FlagType) => {
  const { getEmojiFlagAsync } = useContext()
  const [name, setName] = useState<string>('')
  useEffect(() => {
    getEmojiFlagAsync(countryCode)
      .then(setName)
      .catch(console.error)
  }, [countryCode])
  if (!name) {
    return <ActivityIndicator size={'small'} />
  }
  return (
    <Text
      style={[styles.emojiFlag, { fontSize: flagSize }]}
      allowFontScaling={false}
    >
      <Emoji {...{ name }} />
    </Text>
  )
})

export const Flag = ({
  countryCode,
  withEmoji,
  withFlagButton,
  flagSize
}: FlagType) =>
  withFlagButton ? (
    <View style={styles.container}>
      {withEmoji ? (
        <EmojiFlag {...{ countryCode, flagSize }} />
      ) : (
        <ImageFlag {...{ countryCode, flagSize }} />
      )}
    </View>
  ) : null

Flag.defaultProps = {
  withEmoji: true,
  withFlagButton: true
}
