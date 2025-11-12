// hooks/useAuth.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { navigationRef } from "../navigation/RootNavigation"; // we'll add this next

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://10.31.149.86:5720/api";

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          console.log("🔑 Token loaded from storage");
        } else {
          console.log("⚠️ No token found");
        }
      } catch (err) {
        console.log("Error loading auth:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.success) {
        await AsyncStorage.setItem("token", res.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        console.log("✅ Logged in as:", res.data.user.role);
        console.log("✅ Token saved:", res.data.token);

        // navigate after login
        if (res.data.user.role === "admin") {
          navigationRef.current?.navigate("AdminDashboard");
        } else {
          navigationRef.current?.navigate("StudentDashboard");
        }
      }
    } catch (err) {
      console.log("❌ Login error:", err.response?.data || err.message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setToken(null);
      setUser(null);
      console.log("🚪 Logged out");

      // Redirect to Login screen
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("❌ Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
