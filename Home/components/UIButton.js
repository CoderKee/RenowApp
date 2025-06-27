import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const UIButton = ({ icon, onPress, text, color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: color }]}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        {icon && <Icon name={icon} style={{marginRight: 8,}} size={20} color="white" />}
        <Text style={styles.text}>{text}</Text>
      </View>
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

export default UIButton;