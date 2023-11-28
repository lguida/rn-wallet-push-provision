import {
  requireNativeComponent,
  UIManager,
  Platform,
  type ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'rn-wallet-push-provision' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type RnWalletModuleProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'RnWalletModuleView';

export const RnWalletModuleView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<RnWalletModuleProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
