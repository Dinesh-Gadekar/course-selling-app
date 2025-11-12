import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

import AdminDashboard from "../screens/AdminDashboard";
import ChatScreen from "../screens/ChatScreen";
import FileUploadScreen from "../screens/FileUploadScreen";
import FilesScreen from "../screens/FilesScreen";
import LoginScreen from "../screens/LoginScreen";
import MeetingScreen from "../screens/MeetingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import StudentDashboard from "../screens/StudentDashboard";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user?.role === "admin" ? (
        <>
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="FileUpload" component={FileUploadScreen} />
          <Stack.Screen name="Files" component={FilesScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Meeting" component={MeetingScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
          <Stack.Screen name="FileUpload" component={FileUploadScreen} />
          <Stack.Screen name="Files" component={FilesScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Meeting" component={MeetingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
