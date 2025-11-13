import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import io from "socket.io-client";

const ChatScreen = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeChat = async () => {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));

      const newSocket = io("http://10.31.149.86:5720", {
        auth: { token },
        transports: ["websocket"],
      });

      newSocket.on("connect", () => console.log("🟢 Connected to server via Socket.IO"));
      newSocket.on("disconnect", () => console.log("🔴 Disconnected from server"));

      // ✅ Listen for incoming messages
      newSocket.on("receiveMessage", (data) => {
        console.log("📩 New message received:", data);
        setMessages((prev) => [...prev, data]);
      });

      setSocket(newSocket);

      // ✅ Load old messages
      const res = await axios.get("http://10.31.149.86:5720/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);

      return () => newSocket.disconnect();
    };

    initializeChat();
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("sendMessage", { message }, (response) => {
        if (response.success) {
          setMessage("");
        } else {
          console.error("Error sending message:", response.error);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender?._id === user?._id ? styles.myMessage : styles.otherMessage,
            ]}
          >
            {/* ✅ FIX: Show sender name */}
            <Text style={styles.senderName}>
              {item.sender?.name || "Unknown"}
            </Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  messageContainer: { marginVertical: 5, padding: 10, borderRadius: 10, maxWidth: "80%" },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  otherMessage: { alignSelf: "flex-start", backgroundColor: "#F1F0F0" },
  senderName: { fontWeight: "bold", color: "#333" },
  messageText: { color: "#000" },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, padding: 10 },
  sendButton: { marginLeft: 10, backgroundColor: "#2196F3", borderRadius: 20, padding: 10 },
  sendText: { color: "#fff", fontWeight: "bold" },
});

export default ChatScreen;
