import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function RegisterScreen({ navigation }) {
  const { register, message, setMessage } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");

  const handleRegister = () => {
    setMessage({ text: "", type: "" });
    register(name, email, password, course);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 4000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Registration</Text>

      {message.text ? (
        <Text
          style={[
            styles.alert,
            message.type === "error" ? styles.error : styles.success,
          ]}
        >
          {message.text}
        </Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Course Name"
        value={course}
        onChangeText={setCourse}
      />

      <Button title="Register" onPress={handleRegister} color="#1E88E5" />

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
  alert: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  error: { backgroundColor: "#ffdddd", color: "#d32f2f" },
  success: { backgroundColor: "#ddffdd", color: "#388e3c" },
  link: { color: "#1E88E5", marginTop: 15, textAlign: "center" },
});
