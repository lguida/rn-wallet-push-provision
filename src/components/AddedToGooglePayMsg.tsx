import PropTypes from 'prop-types';
import React from 'react';
import { Dimensions, Image, PixelRatio, Text, View } from 'react-native';

import type { AlreadyAddedMessagePropsType } from './types';
import Style from './style';

const { width: deviceWidth } = Dimensions.get('window');
const widthRatio = deviceWidth / 458;

const G_PAY_ADDED = require('../assets/GPay_Acceptance_Mark_800.png');
// add a default check mark of some kind?
function AddedToGooglePayMsg({
  checkIcon,
  //checkIconColor,
  textColor,
  textContent,
  fontSize,
}: //padding,
AlreadyAddedMessagePropsType) {
  //const minWidthDp = 153;
  //const minMarginDp = 8;
  const baseHeight = 56;
  //const baseBorderRadius = 30;
  const baseMargin = 3.25;
  const baseAlreadyAddedWidth = 105;
  const fontScale = PixelRatio.getFontScale();
  //const minMarginPx = PixelRatio.getPixelSizeForLayoutSize(minMarginDp);
  const adjustedHeight = baseHeight * fontScale;
  //const adjustedWidth = width * widthRatio;
  //const borderColor = '#757775';
  const adjustedAlreadyAddedWidth = baseAlreadyAddedWidth * widthRatio;

  const adjustedMargin = baseMargin * fontScale;
  //add grey border
  return (
    <View style={Style.alreadyAddedMsgContainer}>
      {checkIcon()}

      <Text style={{ fontSize: fontSize, color: textColor }}>
        {textContent}
      </Text>
      <Image
        resizeMode="contain"
        style={{
          height: adjustedHeight,
          width: adjustedAlreadyAddedWidth,
          marginLeft: adjustedMargin,
        }}
        source={G_PAY_ADDED}
      />
    </View>
  );
}

AddedToGooglePayMsg.defaultProps = {
  checkIconColor: '',
  textColor: 'black',
  textContent: 'Added to ',
  fontSize: 12,
  padding: 2,
};

AddedToGooglePayMsg.propTypes = {
  checkIconColor: PropTypes.string,
  textColor: PropTypes.string,
  textContent: PropTypes.string,
  fontSize: PropTypes.number,
  padding: PropTypes.number,
};

export default AddedToGooglePayMsg;
