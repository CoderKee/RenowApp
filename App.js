import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TextInput
} from "react-native";
import LoginScreen from "./LoginScreen/LoginScreen";
import ProfileScreen from "./Home/ProfileScreen";
import MainTabs from "./Home/MainTabs";

const Stack = createStackNavigator();
export default function App() {

    // return (
    //   <SafeAreaView style={styles.container}>
    //     <LoginScreen/>
    //   </SafeAreaView>
    // );

    return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
          style={styles.container}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});

