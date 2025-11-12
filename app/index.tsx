import { Provider as AntProvider } from "@ant-design/react-native";
import React from "react";
import { AuthProvider } from "../hooks/useAuth";
import AppNavigator from "../navigation/AppNavigator"; // ✅ renamed to AppNavigator

export default function App() {
  return (
    <AntProvider>
      <AuthProvider>
       
          <AppNavigator />
        
      </AuthProvider>
    </AntProvider>
  );
}
