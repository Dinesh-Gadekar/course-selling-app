import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@ant-design/react-native";
import { useAuth } from "../hooks/useAuth";

export default function AdminDashboard({ navigation }) {
   const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("FileUpload")}>
        <Text style={styles.text}>Upload Notes or Recordings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Meeting")}>
        <Text style={styles.text}>Host Zoom Meeting</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Chat")}>
        <Text style={styles.text}>Chat with Students</Text>
      </TouchableOpacity>
     <Button
        type="warning"
        style={{ marginTop: 30 }}
        onPress={logout} // ✅ Works now
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  btn: { backgroundColor: "#1E90FF", padding: 15, borderRadius: 8, marginBottom: 20 },
  text: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
