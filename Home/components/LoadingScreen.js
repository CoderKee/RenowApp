import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingScreen = ({ visible, text }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <ActivityIndicator size="large" color="#ffffff" />
          {text && <Text style={styles.loadingText}>{text}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({  
  container: { //This is for the entire loading screen background
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000000', // 00 at the end represents opacity, users should not be able to click any other buttons during loading screen
  },
  wrapper: { //for the box where the activity indicator lies on
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