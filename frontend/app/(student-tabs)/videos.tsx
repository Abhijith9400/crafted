import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";

interface Course {
  _id: string;
  name: string;
  description: string;
  duration: string;
  videoUrl?: string;
}

const API_URL = 'https://crafted-1.onrender.com/api/courses';

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching student courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^\s&]+)/);
    return match ? match[1] : '';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {courses.map((course) => (
        <View key={course._id} style={styles.card}>
          <Text style={styles.title}>{course.name}</Text>
          <Text style={styles.description}>{course.description}</Text>

          {course.videoUrl ? (
            Platform.OS === "web" ? (
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(course.videoUrl)}`}
                title="YouTube video"
                frameBorder="0"
                allowFullScreen
                style={styles.webVideo}
              />
            ) : (
              <YoutubePlayer
                height={200}
                play={false}
                videoId={getYouTubeVideoId(course.videoUrl)}
              />
            )
          ) : (
            <Text style={styles.noVideo}>No video available</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40, // pushes content down
  },
  card: { 
    marginBottom: 32, // extra gap between each course
    borderBottomWidth: 1, 
    borderColor: '#ddd', 
    paddingBottom: 16 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000', 
    marginBottom: 10 
  },
  description: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 16 
  },
  noVideo: { 
    fontSize: 12, 
    color: '#999', 
    fontStyle: 'italic' 
  },
  webVideo: {
    borderRadius: 8,
    overflow: 'hidden',
  }
});
