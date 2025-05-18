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

const CustomInput = ({value, setValue, placeholder, secure, icon}) => {
    return (
        <View style = {styles.inner}>
            <Image source={icon} style = {styles.logo}/>
            <View style={styles.divider}></View>
            <TextInput 
                    style={{flex: 1, paddingVertical:12}}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={setValue}
                    autoCapitalize="none"
                    secureTextEntry={secure}
                  />
        </View>
    )
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: "gray",
    width: "0.2%",
    height: '100%',
    marginRight: 5,
    alignSelf: 'center'   
  },
  inner: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  logo: {
    width: "10%",
    height: "50%",
    resizeMode: 'contain',
    marginRight: 10,
    alignSelf: 'center'   
  },
});
export default CustomInput