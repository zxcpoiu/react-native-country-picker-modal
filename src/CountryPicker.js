/**
 * react-native-country-picker
 * @author xcarpentier<contact@xaviercarpentier.com>
 * @flow
 */

import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Modal, Text, ListView } from 'react-native';
import _ from 'lodash';

import countries from '../data/countries';

import { getHeightPercent } from './ratio';
import CloseButton from './CloseButton';
import styles from './CountryPicker.style';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class CountryPicker extends Component {
  static propTypes = {
    cca2: React.PropTypes.string.isRequired,
    translation: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    closeable: React.PropTypes.bool,
  }
  static defaultProps = {
    translation: 'eng',
  }

  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.letters = _
      .range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
      .map(n => String.fromCharCode(n).substr(0));

    // dimensions of country list and window
    this.itemHeight = getHeightPercent(7);
    this.listHeight = countries.length * this.itemHeight;

    const cca2List = Object.keys(countries);
    this.state = {
      modalVisible: false,
      cca2List,
      dataSource: ds.cloneWithRows(cca2List),
    };
  }

  onSelectCountry(cca2) {
    this.setState({
      modalVisible: false,
    });

    this.props.onChange({
      cca2,
      ...countries[cca2],
      flag: undefined,
      name: this.getCountryName(countries[cca2]),
    });
  }

  getCountryName(country, optionalTranslation) {
    const translation = optionalTranslation || this.props.translation || 'eng';
    return country.name[translation] || country.name.common;
  }

  setVisibleListHeight(offset) {
    this.visibleListHeight = getHeightPercent(100) - offset;
  }

  openModal() {
    this.setState({ modalVisible: true });
  }

  scrollTo(letter) {
    // find position of first country that starts with letter
    const index = this.state.cca2List.map((country) => countries[country].name.common[0])
      .indexOf(letter);
    if (index === -1) {
      return;
    }
    let position = index * this.itemHeight;

    // do not scroll past the end of the list
    if (position + this.visibleListHeight > this.listHeight) {
      position = this.listHeight - this.visibleListHeight;
    }

    // scroll
    this._listView.scrollTo({
      y: position,
    });
  }

  renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onSelectCountry(country)}
        activeOpacity={0.99}
      >
        {this.renderCountryDetail(country)}
      </TouchableOpacity>
    );
  }

  renderLetters(letter, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.scrollTo(letter)}
        activeOpacity={0.6}
      >
        <View style={styles.letter}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderCountryDetail(cca2) {
    const country = countries[cca2];
    return (
      <View style={styles.itemCountry}>
        <View style={styles.itemCountryFlag}>
          <Image
            style={styles.imgStyle}
            source={{ uri: countries[cca2].flag }}
          />
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
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
        >
          <View style={styles.touchFlag}>
            <Image
              style={styles.imgStyle}
              source={{ uri: countries[this.props.cca2].flag }}
            />
          </View>
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContainer}>
            {
              this.props.closeable &&
                <CloseButton onPress={() => this.setState({ modalVisible: false })} />
            }
            <ListView
              contentContainerStyle={styles.contentContainer}
              ref={listView => this._listView = listView}
              dataSource={this.state.dataSource}
              renderRow={country => this.renderCountry(country)}
              initialListSize={30}
              pageSize={countries.length - 30}
              onLayout={
                ({ nativeEvent: { layout: { y: offset } } }) => this.setVisibleListHeight(offset)
              }
            />
            <View style={styles.letters}>
              {this.letters.map((letter, index) => this.renderLetters(letter, index))}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
