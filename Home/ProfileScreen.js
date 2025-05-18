import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ProfileScreen = ({ navigation }) => {
  const handleLogout = async () => {
    // If you're using supabase authentication, you might sign out:
    // await supabase.auth.signOut();
    // Optionally clear any stored authentication state here.

    // Then navigate back to the login screen.
    navigation.replace('Login');
  };

  // Add the logout icon to the header using useLayoutEffect
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
          <Icon name="logout" size={24} color="black" />
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