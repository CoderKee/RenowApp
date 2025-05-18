// ProfileStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{
          headerTitle: 'Profile',
          // We'll set headerRight in the ProfileScreen so it can access navigation easily.
        }}
      />
    </Stack.Navigator>
  );
}
