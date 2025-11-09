import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import useAuth from "../hooks/useAuth";

import AdminHomeScreen from "../screens/AdminHomeScreen";
import CourseDetailScreen from "../screens/CourseDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import UserHomeScreen from "../screens/UserHomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading user...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitle: () => (
          <Image
            source={require("../assets/images/icon.png")}
            style={{ width: 30, height: 30 }}
          />
          
        ),
        headerTitleAlign: "center",
      }}
      
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="UserHome" component={UserHomeScreen} />
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
      <Stack.Screen name="Details" component={CourseDetailScreen} />
    </Stack.Navigator>
  );
}
