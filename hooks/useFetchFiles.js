import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";

export const useFileUpload = (token) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Save the picked file
  const pickFile = (file) => {
    setSelectedFile(file);
  };

  // Upload selected file
  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert("Error", "Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.mimeType || "application/octet-stream",
    });

    try {
      setLoading(true);
      const res = await axios.post(
        "http://10.31.149.86:5720/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Success", res.data.message || "File uploaded successfully");
      setSelectedFile(null);
    } catch (err) {
      console.log("Upload error:", err.response || err.message);
      Alert.alert(
        "Upload Failed",
        err.response?.data?.message || "Try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  return { selectedFile, loading, pickFile, uploadFile };
};
