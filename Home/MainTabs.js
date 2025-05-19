// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ListingScreen from './ListingScreen';
import ProfileScreen from './ProfileScreen';
import PostingScreen from './PostingScreen';
import ProfileStack from './ProfileStack';
import Icon from 'react-native-vector-icons/FontAwesome'; // Using FontAwesome icons

const Tab = createBottomTabNavigator();

export default function MainTabs({route}) {
  const {username} = route.params;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Configure icons for each tab based on route name
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

          // Return the icon component with proper properties
          return <Icon name={iconName} size={size} color={color} />;
        },
        // Customize active and inactive colors
        tabBarActiveTintColor: 'maroon',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Listing" component={ListingScreen} />
      <Tab.Screen
        name="Create Listing"
        children={({ navigation }) => <PostingScreen username={username} navigation={navigation} />}
      />
      <Tab.Screen name="Profile" 
        component={ProfileStack} 
        options={{ headerShown:false }}
      />
    </Tab.Navigator>
  );
}