import React, { useState } from 'react';
import { supabase } from '../server/supabase.js';
import { CommonActions } from '@react-navigation/native';

import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  TouchableOpacity,
  Alert
} from "react-native";
import CustomInput from "./components/CustomInput";
import CustomButton from './components/CustomButton';
export default function Testing({ navigation }) {
    const [error, setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleSignUp = async () => {
      setError("")
      if (!username || !password || !confirmPassword) {
        setError("Please fill all fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }

      const { data: existingUser, error: fetchError } = await supabase
        .from('Users')
        .select('username')
        .eq('username', username)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        setError("Error checking user existence.");
        return;
      }
      if (existingUser) {
        setError("User already exists.");
        return;
      }

      const { data, error } = await supabase
        .from('Users')
        .insert([{ username, password }])

      if (error) {
        setError("Error creating user.");
      } else {
        setError("Account created! You can now log in.");
        setIsLogin(true);
        setUser("");
        setPassword("");
        setConfirmPassword("");
      }
    };


    const handleLogin = async () => {
      setError("")
      if (!username || !password) {
        setError("Please enter username and password.");
        return;
      }

      const { data: user, error } = await supabase
        .from('Users')
        .select('username, password')
        .eq('username', username)
        .single()

      if (error || !user) {
        setError("Invalid username or password.");
        return;
      }
      if (user.password !== password) {
        setError("Invalid username or password.");
        return;
      }

      // setLoggedInUser(user.username);
      // setUser("");
      // setPassword("");

      navigation.replace('MainTabs');

    };


    const handleLogout = () => {
        setLoggedInUser(null);
    };

    if (loggedInUser) {
        return (
          <View style={styles.container}>
            <Image
              source={require("../assets/Renow.png")}
              style={styles.logo}
            />
            <Text style={styles.welcomeText}>Welcome, {loggedInUser}!</Text>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        );
      }

    return (
      <View style={styles.container}>

        <Image 
            source={require("../assets/Renow.png")} 
            style={styles.logo}
            resizeMode='contain'
        />

        {error !== "" && (
          <Text style={{color: 'red'}}>
            {error}
          </Text>
        )}
        <CustomInput placeholder='Username' value={username} setValue={setUser} secure={false} icon={require("../assets/UserIcon.png")}/>

        <CustomInput placeholder='Password' value={password} setValue={setPassword} secure={true} icon={require("../assets/PasswordIcon.png")}/>

        {!isLogin && (
                <CustomInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  secure={true}
                  icon={require("../assets/PasswordIcon.png")}
                />
              )}

        <CustomButton onPress={isLogin ? handleLogin : handleSignUp} text={isLogin ? "Login" : "Sign Up"}/>
        
        <TouchableOpacity
                onPress={() => setIsLogin(!isLogin)}
                style={{ marginTop: 20 }}
              >
                <Text style={styles.toggleText}>
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Login"}
                </Text>
              </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 50,
    marginVertical: 50
  },
  logo:{
    width: 350,
    height: 300,
  },
  toggleText: {
    textAlign: "center",
    color: "#007bff",
  },

});

