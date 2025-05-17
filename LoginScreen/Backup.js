import React, { useState } from "react";
import { 
  StatusBar 
} from "expo-status-bar";
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
import CustomInput from "./components/CustomInput";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Sign Up handler
  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match.");
      return;
    }
    if (users.find((user) => user.email === email)) {
      Alert.alert("Error", "User already exists.");
      return;
    }
    setUsers([...users, { email, password }]);
    Alert.alert("Success", "Account created! You can now log in.");
    setIsLogin(true);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // Login handler
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setLoggedInUser(user.email);
      setEmail("");
      setPassword("");
    } else {
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    // Logged in screen
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/Renow.png")}
          style={styles.logo}
        />
  
        <Text style={styles.welcomeText}>Welcome, {loggedInUser}!</Text>
        <Button title="Logout" onPress={handleLogout} />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Login / Sign Up form screen
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Renow.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {!isLogin && (
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />
      )}

      <Button
        title={isLogin ? "Login" : "Sign Up"}
        onPress={isLogin ? handleLogin : handleSignUp}
        color='maroon'
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
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 700,
    height: 300,

  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  toggleText: {
    textAlign: "center",
    color: "#007bff",
  },
  welcomeText: {
    fontSize: 22,
    marginVertical: 24,
  },
});