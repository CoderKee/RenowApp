import React, { useState } from 'react';
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
export default function Testing() {
    const [error, setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [users, setUsers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleSignUp = () => {
        if (!username || !password || !confirmPassword) {
        setError("Please fill all fields.");
        return;
        }
        if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
        }
        if (users.find((user) => user.username === username)) {
        setError("User already exists.");
        return;
        }
        setUsers([...users, { username, password }]);
        setError("Account created! You can now log in.");
        setIsLogin(true);
        setUser("");
        setPassword("");
        setConfirmPassword("");
    };

    const handleLogin = () => {
        if (!username || !password) {
        setError("Please enter username and password.");
        return;
        }
        const user = users.find(
        (u) => u.username === username && u.password === password
        );
        if (user) {
        setLoggedInUser(user.username);
        setUser("");
        setPassword("");
        } else {
        setError("Invalid username or password.");
        }
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