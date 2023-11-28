import PropTypes from 'prop-types';
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  PixelRatio,
  View,
} from 'react-native';

import type { AddToGooglePayButtonInput } from './types';

import Style from './style';

// localize which image to grab
const ADD_TO = require('../assets/add_to_googlepay_button_content.png');
const G_PAY = require('../assets/googlepay_button_content.png');

function AddToGooglePayButton({ onPress }: AddToGooglePayButtonInput) {
  // Dictated by Google
  //const minWidthDp = 153;
  const minMarginDp = 8;
  const baseHeight = 56;
  const baseBorderRadius = 30;
  const baseMargin = 3.25;
  const borderColor = '#757775';

  const fontScale = PixelRatio.getFontScale();
  const minMarginPx = PixelRatio.getPixelSizeForLayoutSize(minMarginDp);
  const adjustedHeight = baseHeight * fontScale; //Using this for both height and width because individual images are squares

  //const adjustedWidth = width * widthRatio;

  const buttonStyle = StyleSheet.flatten([
    Style.button,
    {
      borderRadius: baseBorderRadius * fontScale,
      borderColor,
      minMargin: minMarginPx,
    },
  ]);
  const adjustedMargin = baseMargin * fontScale;
  //add grey border

  return (
    <TouchableOpacity style={Style.buttonContainer} onPress={onPress}>
      <View style={buttonStyle}>
        <Image
          resizeMode="contain"
          style={{
            height: adjustedHeight,
            width: adjustedHeight,
            marginRight: adjustedMargin,
          }}
          source={ADD_TO}
        />
        <Image
          resizeMode="contain"
          style={{
            height: adjustedHeight,
            width: adjustedHeight,
            marginLeft: adjustedMargin,
          }}
          source={G_PAY}
        />
      </View>
    </TouchableOpacity>
  );
}

AddToGooglePayButton.defaultProps = {
  onPress: () => {},
};

AddToGooglePayButton.propTypes = {
  onPress: PropTypes.func,
};

export default AddToGooglePayButton;
