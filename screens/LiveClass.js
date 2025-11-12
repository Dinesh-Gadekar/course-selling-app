import React from "react";
import { ActivityIndicator, Button, Platform, View } from "react-native";
import { WebView } from "react-native-webview";

export default function LiveClassScreen() {
  const meetingURL = "https://zoom.us/wc/join/MEETING_ID"; // Replace MEETING_ID with your actual Zoom meeting ID

  if (Platform.OS === "web") {
    // On web, open Zoom meeting in a new tab
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Join Live Class"
          onPress={() => window.open(meetingURL, "_blank")}
        />
      </View>
    );
  }

  // On mobile, open inside WebView
  return (
    <WebView
      source={{ uri: meetingURL }}
      style={{ flex: 1 }}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      renderLoading={() => (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      )}
    />
  );
}
