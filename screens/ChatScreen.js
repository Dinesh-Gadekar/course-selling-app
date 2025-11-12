import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import io from "socket.io-client";

const BASE_URL = "http://10.31.149.86:5720"; // ⚠️ Replace with your PC's IP address (not localhost)
const socket = io(BASE_URL, { autoConnect: false });

const ChatScreen = () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Load token and user info
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user"); // must be saved at login
        console.log("🔑 Token loaded from storage");

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUserId(parsedUser._id);

          socket.auth = { token: storedToken };
          socket.connect();
        }
      } catch (err) {
        console.error("❌ Error loading user data:", err);
      }
    };
    loadUserData();
  }, []);

  // ✅ Fetch chat history
  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📜 Loaded messages:", res.data.length);
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Error loading messages:", err.response?.data || err);
    }
  }, [token]);

  // ✅ Socket listeners
  useEffect(() => {
    if (!token) return;

    fetchMessages();

    socket.on("connect", () => console.log("🟢 Connected to server via Socket.IO"));
    socket.on("disconnect", () => console.log("🔴 Disconnected from server"));

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [token]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      socket.emit(
        "sendMessage",
        { senderId: userId, message },
        (response) => {
          if (response?.error) {
            console.error("❌ Send message error:", response);
          } else {
            setMessage("");
          }
        }
      );
    } catch (err) {
      console.error("❌ Send message error:", err);
    }
  };

  // ✅ Render message
  const renderMessage = ({ item }) => {
    const isMine = item.sender === userId || item.sender?._id === userId;
    const senderName =
      typeof item.sender === "object" ? item.sender.name || "Unknown" : "User";

    return (
      <View
        style={[
          styles.messageContainer,
          isMine ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {!isMine && (
          <Text style={styles.senderName}>
            {senderName}
          </Text>
        )}
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  messagesList: { padding: 10 },
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 6,
    borderRadius: 12,
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#EAEAEA",
    alignSelf: "flex-start",
  },
  senderName: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#0078FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
