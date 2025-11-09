import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAuth from "../hooks/useAuth";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.name}!</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Details")}>
        <Text style={styles.buttonText}>Go to Course Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#dc3545" }]} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  welcome: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 8, marginBottom: 15 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
});
