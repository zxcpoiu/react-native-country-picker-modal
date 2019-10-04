import React from 'react'
import { TextInput, StyleSheet, TextInputProps, Platform } from 'react-native'
import { useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  input: {
    height: 48,
    width: '70%',
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineColor: 'transparent',
        outlineOffset: 0
      }
    })
  }
})

type CountryFilterProps = TextInputProps

export const CountryFilter = (props: CountryFilterProps) => {
  const { filterPlaceholderTextColor, fontFamily, fontSize } = useTheme()
  return (
    <TextInput
      testID="text-input-country-filter"
      autoCorrect={false}
      placeholderTextColor={filterPlaceholderTextColor}
      style={[styles.input, { fontFamily, fontSize }]}
      {...props}
    />
  )
}

CountryFilter.defaultProps = {
  autoFocus: false,
  placeholder: 'Filter'
}
