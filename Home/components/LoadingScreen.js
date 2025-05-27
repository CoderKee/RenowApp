import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingScreen = ({ visible, text }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="#ffffff" />
          {text && <Text style={styles.loadingText}>{text}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000040', 
  },
  activityIndicatorWrapper: {
    backgroundColor: '#00000080',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    textAlign: 'center',
  },
});

export default LoadingScreen;