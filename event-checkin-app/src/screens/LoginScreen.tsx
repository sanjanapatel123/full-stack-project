import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { setToken } = useAuthStore();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://192.168.0.102:4000/api/login", {
        email,
        name,
      });

      const token = res.data.token;
      if (!token) throw new Error("No token received");

      setToken(token);
      onLogin();
    } catch (err) {
      Alert.alert("Login failed");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 16,
  },
});
