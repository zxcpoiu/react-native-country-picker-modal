'use strict';

/**
 * react-native-country-picker
 * @author xcarpentier<contact@xaviercarpentier.com>
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  PixelRatio,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  ListView
} from 'react-native';
import countries from 'world-countries';
import _ from 'lodash';
import CountryFlags from './countryFlags';
import {getWidthPercent, getHeightPercent, getPercent} from './ratio';

class CountryPicker extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      cca2: props.cca2,
      currentCountry: this.getCountry(props.cca2),
      modalVisible: false,
      countries: ds.cloneWithRows(this.orderCountryList())
    };
    this.letters = _
      .range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
      .map(n => String.fromCharCode(n).substr(0));
  }

  getCountry({ cca2 }) {
    return _.find(countries, {
      cca2
    });
  }

  getCountryName(country) {
    const translation = this.props.translation || 'eng';
    return (
      country.translations[translation] &&
      country.translations[translation].common
    ) || country.name.common;
  }

  orderCountryList() {
    return _(countries)
      .map(country => _.pick(
        country,
        ['cca2', 'callingCode', 'translations', 'name', 'currency'])
      )
      .sortBy(n => _.deburr(this.getCountryName(n)))
      .value();
  }

  onSelect(country) {

    this.setState({
      modalVisible: false,
      cca2: country.cca2
    });

    if (this.props.onChange) {
      this.props.onChange({
        cca2: country.cca2,
        callingCode: country.callingCode[0],
        name: this.getCountryName(country),
        currency: country.currency
      });
    }
  }

  scrollTo(letter) {
    // dimensions of country list and window
    const itemHeight = getHeightPercent(7);
    const listPadding = getPercent(2);
    const listHeight = countries.length * itemHeight + 2 * listPadding;
    const windowHeight = getHeightPercent(100);

    // find position of first country that starts with letter
    const index = this.orderCountryList().map((country) => {
      return this.getCountryName(country)[0];
    }).indexOf(letter);
    if (index === -1) {
      return;
    }
    let position = index * itemHeight + listPadding;

    // do not scroll past the end of the list
    if (position + windowHeight > listHeight) {
      position = listHeight - windowHeight;
    }

    // scroll
    this._scrollView.scrollTo({
      y: position
    });
  }

  renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={()=> this.onSelect(country)}
        activeOpacity={0.99}>
        {this.renderCountryDetail(country)}
      </TouchableOpacity>
    );
  }

  renderLetters(letter, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={()=> this.scrollTo(letter)}
        activeOpacity={0.6}>
        <View style={styles.letter}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderCountryDetail(country) {
    return (
      <View style={styles.itemCountry}>
        <View style={styles.itemCountryFlag}>
          <Image
            style={styles.imgStyle}
            source={{uri: CountryFlags[country.cca2]}}/>
        </View>
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName}>
            {this.getCountryName(country)}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={()=> this.setState({modalVisible: true})}
          activeOpacity={0.7}>
          <View style={styles.touchFlag}>
            <Image
              style={styles.imgStyle}
              source={{uri: CountryFlags[this.state.cca2]}}/>
          </View>
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <ListView
            contentContainerStyle={styles.contentContainer}
            ref={scrollView => { this._scrollView = scrollView; }}
            dataSource={this.state.countries}
            renderRow={country => this.renderCountry(country)}
            initialListSize={20}
            pageSize={countries.length - 20}
          />
          <View style={styles.letters}>
            {this.letters.map((letter, index) => this.renderLetters(letter, index))}
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    width: getWidthPercent(100),
    backgroundColor: 'white',
    padding: getPercent(2)
  },
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: getPercent(0.5),
    width: getWidthPercent(5.5),
    height: getHeightPercent(2.5)
  },
  imgStyle: {
    resizeMode: 'contain',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8
  },
  itemCountry: {
    flexDirection: 'row',
    height: getHeightPercent(7),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemCountryFlag: {
    justifyContent: 'center',
    alignItems: 'center',
    height: getHeightPercent(7),
    width: getWidthPercent(15)
  },
  itemCountryName: {
    justifyContent: 'center',
    width: getWidthPercent(70),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#ccc',
    height: getHeightPercent(7)
  },
  countryName: {
    fontSize: getHeightPercent(2.2)
  },
  letters: {
    position: 'absolute',
    height: getHeightPercent(100),
    top: 0,
    bottom: 0,
    right: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  letter: {
    height: getHeightPercent(3.3),
    width: getWidthPercent(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  letterText: {
    textAlign: 'center',
    fontSize: getHeightPercent(2.2)
  }
});

CountryPicker.propTypes = {
  cca2: React.PropTypes.string.isRequired,
  translation: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
 };
CountryPicker.defaultProps = {
  translation: 'eng'
};

module.exports = CountryPicker;
