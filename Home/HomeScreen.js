import React from 'react';
import HomeRequest from './homeTabs/HomeRequest';
import HomeService from './homeTabs/HomeService';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';

const TopTab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  return (
        <TopTab.Navigator
          screenOptions={{
            tabBarShowIcon: true,
            // Attempt to force a row layout for the tab items
            tabBarItemStyle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
            tabBarLabelStyle: { marginLeft: 8 },
            tabBarActiveTintColor: '#0C2B72',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          <TopTab.Screen
            name="Requests"
            component={HomeRequest}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AwesomeIcon name="hands-helping" size={size} color={color} />
                
              ),
              title: "Requests", // This will be rendered next to the icon if layout allows              
            }}
          />
          <TopTab.Screen
            name="Services"
            component={HomeService}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcon name="home-repair-service" size={size} color={color} />
              ),
              title: "Services",
            }}
          />
        </TopTab.Navigator>

  );
}

export default HomeScreen

const styles = StyleSheet.create({

})

 // This code below makes the icon above the Title instead of beside it
    
    // <TopTab.Navigator screenOptions={({route}) => ({
    //   // Configure icons for each tab based on route name
    //           tabBarIcon: ({ focused, color, size }) => {
      
    //             if (route.name === 'Requests') {
    //               return <AwesomeIcon name='hands-helping' size={size} color={color} />
    //             } else if (route.name === 'Services') {
    //               return <MaterialIcon name='home-repair-service' size={size} color={color} />
    //             }
    //           },
    //           // Customize active and inactive colors
    //           tabBarActiveTintColor: '#0C2B72',
    //           tabBarInactiveTintColor: 'gray',
    //         })
    // }
    // >
    //   <TopTab.Screen 
    //     name="Requests" 
    //     component={HomeRequest} 
    //   />
    //   <TopTab.Screen 
    //     name="Services" 
    //     component={HomeService} 
    //   />
    // </TopTab.Navigator>