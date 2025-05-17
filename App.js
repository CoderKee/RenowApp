import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TextInput
} from "react-native";
import LoginScreen from "./LoginScreen/LoginScreen";
export default function App() {

    return (
      <SafeAreaView style={styles.container}>
        <LoginScreen/>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});

