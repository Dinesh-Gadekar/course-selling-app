import * as DocumentPicker from "expo-document-picker";
import React, { useContext, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function FileUploadScreen() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { token } = useContext(useAuth); // ✅ Token from your login context

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        setFile(result);
        console.log("📄 File selected:", result);
      } else {
        console.log("❌ File selection canceled");
      }
    } catch (error) {
      console.error("Document Picker Error:", error);
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const uploadFile = async () => {
    if (!file) {
      Alert.alert("No file selected", "Please choose a file to upload");
      return;
    }

    setUploading(true);
    const uploadUrl = "http://10.31.149.86:5720/api/files/upload"; // ✅ your API

    try {
      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.name || `upload_${Date.now()}`,
        type: file.mimeType || "application/octet-stream",
      });

      console.log("📤 Uploading to:", uploadUrl);

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ pass your token
        },
        body: formData,
      });

      const data = await response.json();
      console.log("✅ Upload response:", data);

      if (response.ok) {
        Alert.alert("Success", data.message || "File uploaded successfully!");
        setFile(null);
      } else {
        Alert.alert("Upload Failed", data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      Alert.alert("Error", "Network or server error during upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📤 Upload a File</Text>

      <Button title="Pick File" onPress={pickFile} />
      {file && <Text style={styles.fileName}>Selected: {file.name}</Text>}

      <View style={{ marginTop: 20 }}>
        {uploading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <Button
            title="Upload File"
            onPress={uploadFile}
            disabled={!file}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  fileName: {
    marginTop: 10,
    color: "#555",
    fontSize: 16,
  },
});
