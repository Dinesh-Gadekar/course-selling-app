import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

// Replace with your PC's LAN IP (same Wi-Fi as your phone)
const API_URL = "http://10.143.18.86:5000/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);       // check stored user
  const [loginLoading, setLoginLoading] = useState(false); // login API call

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (err) {
        console.log("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoginLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setUser(res.data);
await AsyncStorage.setItem("user", JSON.stringify(res.data));

      return { success: true, user: res.data.user };
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    } finally {
      setLoginLoading(false);
    }
  };

  const register = async (name, email, password, isAdmin = false) => {
    setLoginLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, isAdmin });
setUser(res.data);
await AsyncStorage.setItem("user", JSON.stringify(res.data));

      return { success: true, user: res.data.user };
    } catch (error) {
      console.log("Register error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
