import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";

const API_URL = "http://10.31.149.86:5720/api/files";

export default function FilesScreen() {
  const { token, loading: authLoading } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // handle both response types
      const fileList =
        Array.isArray(res.data) ? res.data :
        Array.isArray(res.data.files) ? res.data.files :
        res.data.data || [];

      setFiles(fileList);
      console.log("✅ Files fetched:", fileList.length);
    } catch (err) {
      console.log("❌ Error fetching files:", err.response?.data || err.message);
      Alert.alert("Error", "Unable to fetch files from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && token) fetchFiles();
  }, [authLoading, token]);

  const handleOpenFile = (file) => {
    // use actual path or filename depending on backend
    const fileUrl = `http://10.31.149.86:5720/uploads/${file.filename || file}`;
    Linking.openURL(fileUrl).catch(() => Alert.alert("Error", "Unable to open file."));
  };

  if (authLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#32CD32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📁 Uploaded Files</Text>

      {files.length === 0 ? (
        <Text style={styles.noFiles}>No files uploaded yet.</Text>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item._id || item.filename || item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.fileCard} onPress={() => handleOpenFile(item)}>
              <Text style={styles.fileName}>
                {item.originalName || item.filename || item}
              </Text>
              <Text style={styles.meta}>
                {item.mimeType || ""} | {Math.round((item.size || 0) / 1024)} KB
              </Text>
            </TouchableOpacity>
          )}
          refreshing={loading}
          onRefresh={fetchFiles}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  noFiles: { textAlign: "center", marginTop: 20, color: "#666" },
  fileCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  fileName: { color: "#007BFF", fontWeight: "bold", marginBottom: 4 },
  meta: { color: "#555", fontSize: 12 },
});
