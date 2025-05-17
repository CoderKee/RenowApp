import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Pressable
} from "react-native";

const CustomButton = ({onPress, text}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'maroon',
        borderRadius: 20,
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center'
    },
    text: {
        color: 'white'
    }
});
export default CustomButton