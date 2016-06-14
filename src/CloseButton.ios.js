import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const CloseButton = (props) => (
  <View style={styles.closeButton}>
    <TouchableOpacity
      {...props}
    >
      <Image
        source={require('./ios7-close-empty.png')}
        style={styles.closeButtonImage}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 20,
    height: 44,
    width: 44
  },
  closeButtonImage: {
    height: 44,
    width: 44,
    resizeMode: 'contain'
  }
});

export default CloseButton;
