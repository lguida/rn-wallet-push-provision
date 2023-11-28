import type { ReactElement } from 'react';

export type AddToGooglePayButtonInput = {
  onPress: () => {};
};

export type AlreadyAddedMessagePropsType = {
  checkIcon: () => ReactElement;
  checkIconColor: string;
  textColor: string;
  textContent: string;
  fontSize: number;
  padding: number; //maybe object?
};

export type AddToGooglePayInput = {
  alreadyAddedMessageProps: AlreadyAddedMessagePropsType;
  getOpcData: (input: {
    deviceId: string;
    walletAccountId: string;
  }) => String[];
  cardMaskedNum: string;
  cardNetwork: string;
  logger: {
    info: (msg: string, err: any) => {};
    error: (msg: string, err: any) => {};
  }; //Logger?
  onNewWalletCreated: () => void;
};

export type GetWalletDataInput = {
  addCardToGooglePayInput?: AddCardToGooglePayInputType;
  remoteAccountId: string;
};

export type GetWalletDataResponse = {
  account: {
    addCardToGooglePay: {
      address: {
        addressLine1: string;
        city: string;
        country: string;
        postalCode: string;
        state: string;
      };
      last4: string;
      opaquePaymentCard: string;
    };
  };
};

export type AddCardToGooglePayInputType = {
  appVersion: string;
  deviceType: string;
  deviceId: string;
  remoteCardId: string;
  walletAccountId: string;
};

export type LaunchAddToWalletParams = {
  getOpcData: (input: {
    deviceId: string;
    walletAccountId: string;
  }) => String[];
  onNewWalletCreated: () => void;
  onPushProvisionSuccess: () => void;
};

export type GetIsCardAlreadyAddedType = {
  cardMaskedNum: string;
  cardNetwork: string;
};
