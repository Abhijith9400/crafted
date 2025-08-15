import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Calendar } from "lucide-react-native";

interface Announcement {
  _id?: string;
  title: string;
  content: string;
  date: string;
  priority: "low" | "medium" | "high";
}

const API_URL = "https://crafted-1.onrender.com/api/announcements"; // ← match backend IP

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#fe6519";
      case "low":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Announcements</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fe6519" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {announcements.map((announcement) => (
            <View key={announcement._id} style={styles.announcementCard}>
              <View style={styles.priorityContainer}>
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor(announcement.priority) },
                  ]}
                />
                <Text style={styles.priorityText}>
                  {announcement.priority.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementContent}>
                {announcement.content}
              </Text>

              <View style={styles.dateContainer}>
                <Calendar size={14} color="#666" strokeWidth={2} />
                <Text style={styles.dateText}>{announcement.date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#000" },
  content: { flex: 1, padding: 16 },
  announcementCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  priorityContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  priorityText: { fontSize: 12, fontWeight: "600", color: "#666" },
  announcementTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  announcementContent: { fontSize: 14, color: "#666", marginBottom: 12 },
  dateContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 12, color: "#666" },
});
