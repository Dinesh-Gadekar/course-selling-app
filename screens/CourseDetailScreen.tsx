import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function CourseDetailsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Details Screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
