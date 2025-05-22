
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

//This file might not be necessary -KH
export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{
          headerTitle: 'Profile',
        }}
      />
    </Stack.Navigator>
  );
}
