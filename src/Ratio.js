'use strict';

import React from 'react-native';
const {height, width} = React.Dimensions.get('window');

// remove the status bar height since the modal view does not cover this area
if (React.Platform.OS === 'android') {
  height = height - 24;
}

class Ratio {
  constructor() {}

  getWidthPercent(percentage) {
    return (width * percentage) / 100;
  }

  getHeightPercent(percentage) {
    return (height * percentage) / 100;
  }

  getPercent(percentage) {
    return ((height + width) / 2 * percentage) / 100;
  }
}

module.exports = new Ratio();
