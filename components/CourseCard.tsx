import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CourseCard({ title, description, price, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text numberOfLines={2} style={styles.description}>{description}</Text>
      <Text style={styles.price}>₹{price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  description: { fontSize: 14, color: '#555', marginVertical: 5 },
  price: { fontSize: 16, fontWeight: '600', color: '#007bff' },
});
