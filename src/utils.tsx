import { NativeModules, Platform } from 'react-native';
import type {
  GetIsCardAlreadyAddedType,
  LaunchAddToWalletParams,
} from './components/types';

const { RnWalletModule } = NativeModules;

export const getIsCardAlreadyAdded = ({
  cardMaskedNum,
  cardNetwork,
}: GetIsCardAlreadyAddedType) => {
  if (Platform.OS === 'android') {
    return RnWalletModule.checkIfAlreadyAdded(cardMaskedNum, cardNetwork);
  }
};

export const getDeviceId = () => {
  if (Platform.OS === 'android') {
    return RnWalletModule.getDeviceId();
  }
};

export const getWalletId = () => {
  if (Platform.OS === 'android') {
    return RnWalletModule.getWalletId();
  }
};

export const launchAddToWallet = async ({
  getOpcData,
  onNewWalletCreated,
  onPushProvisionSuccess,
}: LaunchAddToWalletParams) => {
  if (Platform.OS === 'android') {
    const deviceId = await getDeviceId();
    const walletAccountId = await getWalletId();

    if (getOpcData) {
      const opcData = await getOpcData({
        deviceId,
        walletAccountId,
      });

      const result = await RnWalletModule.handleAddToGooglePay(...opcData);

      if (result === 'PUSH_PROVISION_SUCCESS') {
        onPushProvisionSuccess && onPushProvisionSuccess();
      } else if (result === 'NEW_WALLET_CREATED' && onNewWalletCreated) {
        onNewWalletCreated && onNewWalletCreated(); //need to somehow get ish to rerender
      }
    }
  }
};
