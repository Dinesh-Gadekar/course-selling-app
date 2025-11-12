import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function FileUploadScreen() {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const API_URL = "http://10.31.149.86:5720/api/files/upload";

  // ✅ File picker function
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // allow any file type
        copyToCacheDirectory: true,
        multiple: false,
      });

      // Debug log
      console.log("📄 Picker result:", result);

      if (result.canceled) {
        Alert.alert("File selection cancelled");
        return;
      }

      // result.assets[0] contains the file object in latest Expo versions
      const selectedFile = result.assets?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        console.log("✅ File selected:", selectedFile);
      } else {
        Alert.alert("No file selected");
      }
    } catch (err) {
      console.error("❌ File pick error:", err);
      Alert.alert("Error selecting file", err.message);
    }
  };

  // ✅ Upload file function
  const uploadFile = async () => {
    if (!file) return Alert.alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.mimeType || "application/octet-stream",
      name: file.name || "upload.bin",
    });

    setUploading(true);
    try {
      console.log("📤 Uploading to:", API_URL);
      console.log("🔑 Token:", token?.substring(0, 20) + "...");

      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Upload success:", response.data);
      Alert.alert("File uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload error:", err.message);
      Alert.alert("Upload failed", err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {uploading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button title="Pick a File" onPress={pickFile} />
          {file && (
            <Text style={{ marginVertical: 10 }}>
              Selected: {file.name || "Unnamed File"}
            </Text>
          )}
          <Button title="Upload File" onPress={uploadFile} />
        </>
      )}
    </View>
  );
}
