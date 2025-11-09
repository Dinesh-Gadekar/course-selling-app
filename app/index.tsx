import { Provider as AntProvider } from "@ant-design/react-native";
import React from "react";
import { AuthProvider } from "../hooks/useAuth";
import StackNavigator from "../navigation/AppNavigator"; // or whatever you named it

export default function App() {
  return (
    <AntProvider>
      <AuthProvider>
       
          <StackNavigator />
       
      </AuthProvider>
    </AntProvider>
  );
}
