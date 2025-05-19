import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";

const CustomPriceInput = ({ value, setValue, placeholder, charLimit = 10 }) => {
  const isAtLimit = value.length >= charLimit;
  const handleChange = (text) => {
    const numericText = text.replace(/[^0-9.]/g, ''); 
    setValue(numericText);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inner, isAtLimit && styles.limit]}>
        <Text style={styles.dollarSign}>$</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChange}
          keyboardType="numeric"
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
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginRight: 5, 
    alignSelf: 'center'
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,

  },
  charCount: {
    marginTop: 5,
    textAlign: 'right',
    color: 'gray',
    fontSize: 12,
  },
});

export default CustomPriceInput;