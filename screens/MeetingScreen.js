import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import API from "../utils/api";

export default function MeetingScreen() {
  const [meeting, setMeeting] = useState(null);

  const createMeeting = async () => {
    const res = await API.post("/zoom");
    setMeeting(res.data);
  };

  const loadMeetings = async () => {
    const res = await API.get("/zoom");
    setMeeting(res.data[0]);
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  if (meeting)
    return <WebView source={{ uri: meeting.url }} style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>No active meeting</Text>
      <Button title="Create Meeting" onPress={createMeeting} />
    </View>
  );
}
