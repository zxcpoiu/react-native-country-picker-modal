import React from 'react'
// import 'react-native'

import renderer from 'react-test-renderer'

import CountryPicker from '../src/'

it('CountryPicker can be created', () => {
  const picker = renderer.create(
    <CountryPicker countryCode={'US'} onSelect={() => {}} />
  )
  expect(picker).toBeDefined()
})

it('<CountryPicker /> toMatchSnapshot', () => {
  const tree = renderer
    .create(<CountryPicker countryCode={'US'} onSelect={() => {}} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
