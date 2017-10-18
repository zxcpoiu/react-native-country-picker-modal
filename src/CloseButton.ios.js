// @flow
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

const styles = StyleSheet.create({
  closeButton: {
    height: 48,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonImage: {
    height: 35,
    width: 35,
    resizeMode: 'contain'
  }
})

const CloseButton = props => (
  <View style={styles.closeButton}>
    <TouchableOpacity {...props}>
      <Image
        source={require('./ios7-close-empty.png')}
        style={styles.closeButtonImage}
      />
    </TouchableOpacity>
  </View>
)

export default CloseButton
