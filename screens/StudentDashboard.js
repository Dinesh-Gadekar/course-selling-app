import { Button } from "@ant-design/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function StudentDashboard({ navigation }) {
   const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Files")}>
        <Text style={styles.text}>View Notes / Recordings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Meeting")}>
        <Text style={styles.text}>Join Zoom Meeting</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Chat")}>
        <Text style={styles.text}>Chat with Admin</Text>
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
  btn: { backgroundColor: "#32CD32", padding: 15, borderRadius: 8, marginBottom: 20 },
  text: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
