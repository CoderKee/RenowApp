import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen/LoginScreen";
import RootNavigator from "./Home/RootNavigator";
import { UserProvider } from "./Home/globalContext/UserContext";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TextInput
} from "react-native";


const Stack = createStackNavigator();
export default function App() {

    return (
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
              style={styles.container}
            />
            <Stack.Screen 
              name="RootNavigator" 
              component={RootNavigator} 
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});

