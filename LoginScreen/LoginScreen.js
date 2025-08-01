import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { supabase } from '../server/supabase.js';
import { useUser } from '../Home/globalContext/UserContext.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  TouchableOpacity,
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
    const [loading, setLoading] = useState(false);

    const { setUsername } = useUser();

    const handleSignUp = async () => {
      setError("")
      if (!username || !password || !confirmPassword) {
        setError("Please fill all fields.");
        return;
      }

      if (username.length < 4) {
        setError("Username should be at least 4 characters")
        return;
      }

      if (password.length < 8) {
        setError("Password should be at least 8 characters")
        return;
      }
      
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }

      setLoading(true);
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
      /*
            const {data, error} = await supabase.auth.signUp({
        email: `${username}@renow.com`,
        password: password
      })*/
        /*
        const {} = await supabase
        .from('Users')
        .insert([{ username, password, email: `${username}@renow.com`}])
        */
      setLoading(false);
    };


    const handleLogin = async () => {
      setError("")
      if (!username || !password) {
        setError("Please enter username and password.");
        return;
      }

      setLoading(true);
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
      setPassword("");
      setUsername(username);
      navigation.replace('RootNavigator', {username});
      setLoading(false);
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
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraScrollHeight={40} 
    >
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
          
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          <CustomButton 
            onPress={isLogin ? handleLogin : handleSignUp} 
            text={isLogin ? "Login" : "Sign Up"}
            color={loading? "grey" : "maroon"}
            disabled={loading}
          />
          
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
      </KeyboardAwareScrollView>
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

