import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { NativeModules } from 'react-native';

import { AddToGooglePayButton, AddedToGooglePayMsg } from '.';
import type { AddToGooglePayInput } from './types';

function AddToGooglePay({
  alreadyAddedMessageProps,
  cardMaskedNum,
  cardNetwork,
  getOpcData,
  logger,
  onNewWalletCreated,
}: AddToGooglePayInput) {
  const { RnWalletModule } = NativeModules;

  const [alreadyAdded, setAlreadyAdded] = useState(false);

  const checkIfCardAdded = async () => {
    try {
      const isAdded = await RnWalletModule.checkIfAlreadyAdded(
        cardMaskedNum,
        cardNetwork
      );
      setAlreadyAdded(isAdded);
    } catch (err) {
      logger?.error(
        'DigitalWalletButton.useEffect.checkIfCardAdded:error',
        err
      );
    }
  };

  useEffect(() => {
    checkIfCardAdded();
  });

  const handleAddToGooglePay = async () => {
    try {
      const deviceId = await RnWalletModule.getDeviceId();
      const walletAccountId = await RnWalletModule.getWalletId();

      const opcData = await getOpcData({
        deviceId,
        walletAccountId,
      });

      const result = await RnWalletModule.handleAddToGooglePay(...opcData);

      if (result === 'PUSH_PROVISION_SUCCESS') {
        await checkIfCardAdded();
      } else if (result === 'NEW_WALLET_CREATED' && onNewWalletCreated) {
        onNewWalletCreated();
      }
    } catch (err) {
      logger?.info('DigitalWalletButton.handleAddToGooglePay:error', err);
    }
  };

  return alreadyAdded ? (
    <AddedToGooglePayMsg {...alreadyAddedMessageProps} />
  ) : (
    <AddToGooglePayButton onPress={handleAddToGooglePay} />
  );
}

AddToGooglePay.propTypes = {
  getOpc: PropTypes.func,
  cardMaskedNum: PropTypes.string,
  remoteAccountId: PropTypes.string,
  remoteCardId: PropTypes.string,
  logger: PropTypes.object,
};

export default AddToGooglePay;
