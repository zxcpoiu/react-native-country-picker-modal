import React, { useState } from 'react'
import { View, Text, StyleSheet, PixelRatio, Switch } from 'react-native'
import CountryPicker from './src/'
import { CountryCode, Country } from './src/types'
import { Row } from './src/Row'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginBottom: 5
  },
  data: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#ddd',
    borderColor: '#888',
    borderWidth: 1 / PixelRatio.get(),
    color: '#777'
  }
})

interface OptionProps {
  title: string
  value: boolean
  onValueChange(value: boolean): void
}
const Option = ({ value, onValueChange, title }: OptionProps) => (
  <Row fullWidth>
    <Text style={styles.instructions}>{title}</Text>
    <Switch {...{ value, onValueChange }} />
  </Row>
)

export default function App() {
  const [countryCode, setCountryCode] = useState<CountryCode>('FR')
  const [country, setCountry] = useState<Country>(null)
  const [withCountryName, setWithCountryName] = useState<boolean>(false)
  const [withFlag, setWithFlag] = useState<boolean>(true)
  const [withEmoji, setWithEmoji] = useState<boolean>(true)
  const [withFilter, setWithFilter] = useState<boolean>(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false)
  const [withCallingCode, setWithCallingCode] = useState<boolean>(false)
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Country Picker !</Text>
      <Option
        title="With country name on button"
        value={withCountryName}
        onValueChange={setWithCountryName}
      />
      <Option title="With flag" value={withFlag} onValueChange={setWithFlag} />
      <Option
        title="With emoji"
        value={withEmoji}
        onValueChange={setWithEmoji}
      />
      <Option
        title="With filter"
        value={withFilter}
        onValueChange={setWithFilter}
      />
      <Option
        title="With calling code"
        value={withCallingCode}
        onValueChange={setWithCallingCode}
      />
      <Option
        title="With alpha filter code"
        value={withAlphaFilter}
        onValueChange={setWithAlphaFilter}
      />
      <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          withCountryName,
          withAlphaFilter,
          withCallingCode,
          withEmoji,
          onSelect
        }}
      />
      <Text style={styles.instructions}>Press on the flag to open modal</Text>
      {country !== null && (
        <Text style={styles.data}>{JSON.stringify(country, null, 2)}</Text>
      )}
    </View>
  )
}
