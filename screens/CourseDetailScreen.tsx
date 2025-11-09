import React from 'react';
import { ActivityIndicator, Alert, Button, Text, View } from 'react-native';
import useAuth from '../hooks/useAuth';

export default function CourseDetailScreen({ route, navigation }) {
  const { user, loading } = useAuth();
  const course = route.params?.course;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Checking login...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View>
        <Text>No course data available.</Text>
      </View>
    );
  }

  const handleEnroll = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to enroll', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    if (user.isAdmin) {
      Alert.alert('Access Denied', 'Admins cannot enroll in courses');
      return;
    }

    Alert.alert('Success', `You are enrolled in ${course.title}!`);
    // TODO: call backend API to save enrollment
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{course.title}</Text>
      <Text style={{ marginVertical: 10 }}>{course.description}</Text>
      <Text style={{ fontSize: 18, color: 'green' }}>₹{course.price}</Text>
      <Button title="Enroll Now" onPress={handleEnroll} />
    </View>
  );
}
