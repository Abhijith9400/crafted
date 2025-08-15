import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BookOpen, Calendar, Award, Play, Clock, Bell, ChevronRight } from 'lucide-react-native';

const BASE_URL = "https://crafted-1.onrender.com/api/students";

interface QuickLinkProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
  color: string;
}

function QuickLink({ title, description, icon, onPress, color }: QuickLinkProps) {
  return (
    <TouchableOpacity style={styles.quickLink} onPress={onPress}>
      <View style={[styles.quickLinkIcon, { backgroundColor: color + '20' }]}>{icon}</View>
      <View style={styles.quickLinkContent}>
        <Text style={styles.quickLinkTitle}>{title}</Text>
        <Text style={styles.quickLinkDescription}>{description}</Text>
      </View>
      <ChevronRight size={20} color="#666" strokeWidth={2} />
    </TouchableOpacity>
  );
}

interface UpcomingClassProps {
  subject: string;
  time: string;
  teacher: string;
  color: string;
}

function UpcomingClass({ subject, time, teacher, color }: UpcomingClassProps) {
  return (
    <View style={styles.classCard}>
      <View style={[styles.classColorBar, { backgroundColor: color }]} />
      <View style={styles.classContent}>
        <Text style={styles.classSubject}>{subject}</Text>
        <Text style={styles.classTime}>{time}</Text>
        <Text style={styles.classTeacher}>with {teacher}</Text>
      </View>
    </View>
  );
}

export default function StudentDashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch student profile
  const fetchProfile = async () => {
    try {
      const id = await AsyncStorage.getItem("studentId");
      if (!id) {
        Alert.alert("Error", "No student ID found in storage");
        setLoading(false);
        return;
      }
      const res = await axios.get(`${BASE_URL}/${id}`);
      setProfileData(res.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch profile data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const navigateToTab = (tab: string) => {
    router.push(`/(student-tabs)/${tab}` as any);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi,</Text>
            <Text style={styles.studentName}>{profileData?.name || "Student"}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#666" strokeWidth={2} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <BookOpen size={24} color="#2196F3" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active Courses</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Calendar size={24} color="#4CAF50" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Today's Classes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Award size={24} color="#FFA500" strokeWidth={2} />
            </View>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>

        {/* Today's Classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          <View style={styles.classesContainer}>
            <UpcomingClass subject="Advanced Mathematics" time="10:00 AM - 11:30 AM" teacher="Dr. Johnson" color="#2196F3" />
            <UpcomingClass subject="Physics Fundamentals" time="2:00 PM - 3:30 PM" teacher="Prof. Williams" color="#4CAF50" />
          </View>
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickLinks}>
            <QuickLink
              title="Announcements"
              description="Latest updates from center"
              icon={<Bell size={20} color="#F44336" strokeWidth={2} />}
              onPress={() => navigateToTab('announcements')}
              color="#F44336"
            />
            <QuickLink
              title="Weekly Timetable"
              description="View your class schedule"
              icon={<Calendar size={20} color="#607D8B" strokeWidth={2} />}
              onPress={() => navigateToTab('timetable')}
              color="#607D8B"
            />
            <QuickLink
              title="Feedback"
              description="Write your thoughts"
              icon={<Play size={20} color="#607D8B" strokeWidth={2} />}
              onPress={() => navigateToTab('feedback')}
              color="#316487ff"
            />
            <QuickLink
              title="About"
              description="About Us"
              icon={<Award size={20} color="#607D8B" strokeWidth={2} />}
              onPress={() => navigateToTab('about')}
              color="#607D8B"
            />
            <QuickLink
              title="Exam"
              description="Write your exam"
              icon={<Award size={20} color="#607D8B" strokeWidth={2} />}
              onPress={() => navigateToTab('exam')}
              color="#607D8B"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Math exam result published</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New physics video uploaded</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Attendance marked for chemistry</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#F44336',
    borderRadius: 4,
  },
  quickStats: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  classesContainer: {
    gap: 12,
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  classColorBar: {
    height: 4,
    width: '100%',
  },
  classContent: {
    padding: 16,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  classTime: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '600',
    marginBottom: 2,
  },
  classTeacher: {
    fontSize: 12,
    color: '#666',
  },
  quickLinks: {
    gap: 12,
  },
  quickLink: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickLinkContent: {
    flex: 1,
  },
  quickLinkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  quickLinkDescription: {
    fontSize: 14,
    color: '#666',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFA500',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
});