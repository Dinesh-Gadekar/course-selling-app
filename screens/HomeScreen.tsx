import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import CourseCard from '../components/CourseCard';

export default function HomeScreen({ navigation }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://10.143.18.86:5000/api/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CourseCard
            title={item.title}
            description={item.description}
            price={item.price}
            onPress={() => navigation.navigate('CourseDetail', { course: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
});
