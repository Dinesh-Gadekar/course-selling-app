import { Modal } from "@ant-design/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useAuth from "../hooks/useAuth";

export default function UserHomeScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://10.143.18.86:5000/api/courses");
        setCourses(res.data);
      } catch (error) {
        console.log("Error fetching courses:", error);
        Alert.alert("Error", "Unable to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout(); // if useAuth provides logout()
      } else {
        await AsyncStorage.removeItem("user");
      }
      navigation.replace("Login");
    } catch (err) {
      console.log("Logout error:", err);
      Alert.alert("Error", "Unable to logout. Please try again.");
    }
  };

  if (loading || authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ Header with Back & Logout */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Available Courses</Text>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Course List */}
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.price}>₹{item.price}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (!user) {
                  Alert.alert("Login Required", "Please login to view course details", [
                    { text: "OK", onPress: () => navigation.navigate("Login") },
                  ]);
                  return;
                }
                setSelectedCourse(item);
              }}
            >
              <Text style={styles.buttonText}>Go to Course Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ✅ Ant Design Modal */}
      <Modal
        visible={!!selectedCourse}
        transparent
        maskClosable
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse?.title}
        footer={[
          { text: "Close", onPress: () => setSelectedCourse(null) },
          {
            text: "Enroll",
            onPress: () => {
              Alert.alert("Enrolled", `You have enrolled in ${selectedCourse?.title}`);
              setSelectedCourse(null);
            },
          },
        ]}
      >
        <View>
          <Text style={{ marginBottom: 10 }}>{selectedCourse?.description}</Text>
          <Text style={{ fontWeight: "bold" }}>Price: ₹{selectedCourse?.price}</Text>
          <Text style={{ marginTop: 10 }}>
            Instructor: {selectedCourse?.instructor?.name}
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#f44336",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },

  courseCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  price: { color: "green", marginVertical: 5 },
  button: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  buttonText: { color: "#fff", textAlign: "center" },
});
