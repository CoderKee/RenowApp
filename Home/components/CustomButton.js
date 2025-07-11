import {
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

const CustomButton = ({ onPress, text, color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: '80%',
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default CustomButton;