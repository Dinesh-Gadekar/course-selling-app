import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAuth from "../hooks/useAuth";

export default function AdminHomeScreen({ navigation }) {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Admin!</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("Details")}
      >
        <Text style={styles.buttonText}>View Course Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logout]} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, marginVertical: 10 },
  logout: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff", fontSize: 16 }
});
