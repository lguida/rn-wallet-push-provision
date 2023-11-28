import PropTypes from 'prop-types';
import React from 'react';
import { Text, Platform } from 'react-native';

import type { AddToGooglePayInput } from './components';
import AddToGooglePay from './components/AddToGooglePay';

function AddToWalletButton({
  alreadyAddedMessageProps,
  cardMaskedNum,
  cardNetwork,
  getOpcData,
  logger,
  onNewWalletCreated,
}: AddToGooglePayInput) {
  return Platform.OS === 'android' ? (
    <AddToGooglePay
      alreadyAddedMessageProps={alreadyAddedMessageProps}
      cardMaskedNum={cardMaskedNum}
      cardNetwork={cardNetwork}
      getOpcData={getOpcData}
      logger={logger}
      onNewWalletCreated={onNewWalletCreated}
    />
  ) : (
    <Text>Feature Not Yet Available</Text>
  );
}

AddToWalletButton.defaultProps = {
  onPress: () => {},
};

AddToWalletButton.propTypes = {
  onPress: PropTypes.func,
  //TODO: update props
};

export default AddToWalletButton;
