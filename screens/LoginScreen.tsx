import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useAuth from "../hooks/useAuth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please fill all fields");

    const res = await login(email, password);
    if (!res.success) return Alert.alert("Error", res.message);

    if (res.user?.isAdmin) {
      navigation.replace("AdminHome");
    } else {
      navigation.replace("UserHome");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      {loginLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Logging in...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  link: { textAlign: "center", marginTop: 15, color: "#007bff" },
  loading: { justifyContent: "center", alignItems: "center", marginVertical: 10 },
});
