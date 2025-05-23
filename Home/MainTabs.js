// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ListingScreen from './ListingScreen';
import ProfileScreen from './ProfileScreen';
import PostingScreen from './PostingScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export default function MainTabs({route}) {
  const {username} = route.params;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Listing') {
            iconName = 'list-alt';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Create Listing') {
            iconName = 'plus';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        // Customize active and inactive colors
        tabBarActiveTintColor: 'maroon',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Tab.Screen 
        name="Listing" 
        component={ListingScreen}
        initialParams={{ username }}
      />
      <Tab.Screen
        name="Create Listing"
        component={PostingScreen}
        initialParams={{ username: username, item: undefined}}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown:true }}
      />
    </Tab.Navigator>
  );
}