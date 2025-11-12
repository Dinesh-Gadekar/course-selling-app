import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hooks/useAuth"; // ✅ import AuthContext hook

export default function LoginScreen({ navigation }) {
  const { login, token, user, loading } = useAuth(); // ✅ use global login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setSubmitting(true);
    console.log("🔐 Sending login request...");

    await login(email, password); // ✅ use AuthContext login()

    setSubmitting(false);
  };

  // ✅ Watch for token update and navigate only when ready
  useEffect(() => {
    if (token && user) {
      console.log("✅ Logged in as:", user.role);

      if (user.role === "admin") {
        navigation.replace("AdminDashboard");
      } else {
        navigation.replace("StudentDashboard");
      }
    }
  }, [token, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, submitting && styles.disabledButton]}
        onPress={handleLogin}
        disabled={submitting || loading}
      >
        {submitting || loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>
          Don’t have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#7aa7e0" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  registerText: { textAlign: "center", marginTop: 16, color: "#007bff" },
});
