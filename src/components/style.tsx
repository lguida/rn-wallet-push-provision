import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  alreadyAddedMsgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  button: {
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    minHeight: 46,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
    display: 'flex',
  },
  buttonContainer: {
    flexDirection: 'row',
    minHeight: 60,
  },
  extra: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 75,
    margin: 5,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'black',
    borderRadius: 4,
  },
});
