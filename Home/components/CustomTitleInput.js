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
} from "react-native";

const CustomTitleInput = ({ value, setValue, placeholder, charLimit = 50 }) => {
  const isAtLimit = value.length >= charLimit;
  return (
    <View style={styles.container}>
      <View style={[styles.inner, isAtLimit && styles.limit]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={value}
          onChangeText={setValue}
          autoCapitalize="none"
          multiline={true}
          textAlignVertical="top"
          maxLength={charLimit}
        />
      </View>
      <Text style={styles.charCount}>
        {value.length} / {charLimit} characters
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  limit: {
    borderColor: 'red'
  },
  container: {
    width: '100%',
    marginVertical: 10,
  },
  inner: {
    backgroundColor: 'white',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 12,
    color: 'black',
  },
  charCount: {
    marginTop: 5,
    textAlign: 'right',
    color: 'gray',
    fontSize: 12,
  },
});
export default CustomTitleInput