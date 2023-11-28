# rn-wallet-push-provision

Native code for in-app digital wallet provisioning

## Installation

```sh
npm install rn-wallet-push-provision
```

## Usage

```js
import { RnWalletModuleView } from "rn-wallet-push-provision";

// ...

<RnWalletModuleView color="tomato" />
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)


# TODO
- Android
    - (Done) Add visa/mastercard logic to native code
    - (Done) get the device version and type and pass in
    - merge get functions and send back in stringified JSON format or ReadableMap?
    - (Done) check if the encryption can be done with just `getBytes()`
    - (Done) check if we need the `createWallet` failsafe function
        - (Done) add event handler to add the card after the wallet is created
        - add param to toggle and off eager wallet creation
- React Native
    - (Done) Pass gql function in to component
    - (Done) add formatting flexibility and text for button and "added" icon
    - Allow the user to send through the component to display if the card is already added?
    - localize google pay logo for different languages
- Cleanup
    - write docs
    - (DONE) remove console logs
    - make sure logging is being done well
    - (DONE) add linter
    - (DONE) add formatter
