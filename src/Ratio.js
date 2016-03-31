'use strict';

var dimension = require('react-native').Dimensions.get('window');

class Ratio {
  constructor() {}

  getWidthPercent(percentage) {
    return (dimension.width * percentage) / 100;
  }

  getHeightPercent(percentage) {
    return (dimension.height * percentage) / 100;
  }

  getPercent(percentage) {
    return ((dimension.height + dimension.width) / 2 * percentage) / 100;
  }
}

module.exports = new Ratio();
