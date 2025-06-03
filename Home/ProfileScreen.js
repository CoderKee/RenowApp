import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CustomButton from './components/CustomButton'
import { useUser } from '../Home/globalContext/UserContext'
import { supabase } from '../server/supabase.js'
import { useNavigation } from '@react-navigation/native'
import CompletedRequest from './profileTabs/CompletedListing.js'

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
    <View style={{ flex: 1, alignItems: 'center'}}>
      <View>
        <CustomButton
          color={"green"}
          text="View Completed Listings"
          onPress={() => navigation.navigate('CompletedListing')}  
        />
      </View>
      <Text></Text>
    </View>
  );

}

export default ProfileScreen

const styles = StyleSheet.create({})