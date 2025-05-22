import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ProfileScreen = ({ navigation }) => {
  const handleLogout = async () => {
    navigation.replace('Login');
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() =>
            Alert.alert(
              'Confirm Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: handleLogout },
              ]
            )
          }
        >
          <Icon name="logout" size={24} color="maroon" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Your Profile Screen</Text>
    </View>
  );

}

export default ProfileScreen

const styles = StyleSheet.create({})