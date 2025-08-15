import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Users, Calendar, BookOpen, TrendingUp, Bell, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";
import axios from "axios";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface Stats {
  totalStudents: number;
  activeCourses: number;
  upcomingExams: number;
  thisMonthPerformance: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: color + "20" }]}>
          {icon}
        </View>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
}

function QuickAction({ title, description, icon, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickActionIcon}>{icon}</View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "announcement":
        router.push("/(admin-tabs)/announcements");
        break;
      case "exam":
        router.push("/(admin-tabs)/exam");
        break;
      case "student":
        router.push("/(admin-tabs)/students");
        break;
      case "timetable":
        router.push("/(admin-tabs)/timetable");
        break;
      case "results":
        router.push("/(admin-tabs)/results");
        break;
      default:
        break;
    }
  };

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const res = await axios.get("https://crafted-1.onrender.com/api/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi,</Text>
          <Text style={styles.adminName}>Admin</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {loading ? (
            <ActivityIndicator size="large" color="#fe6519" />
          ) : (
            <>
              <StatCard
                title="Total Students"
                value={stats?.totalStudents.toString() || "0"}
                icon={<Users size={24} color="#fe6519" strokeWidth={2} />}
                color="#fe6519"
              />
              <StatCard
                title="Active Courses"
                value={stats?.activeCourses.toString() || "0"}
                icon={<BookOpen size={24} color="#4CAF50" strokeWidth={2} />}
                color="#4CAF50"
              />
              <StatCard
                title="Upcoming Exams"
                value={stats?.upcomingExams.toString() || "0"}
                icon={<Calendar size={24} color="#2196F3" strokeWidth={2} />}
                color="#2196F3"
              />
              <StatCard
                title="This Month"
                value={stats?.thisMonthPerformance || "0%"}
                icon={<TrendingUp size={24} color="#9C27B0" strokeWidth={2} />}
                color="#9C27B0"
              />
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <QuickAction
              title="Create Announcement"
              description="Send updates to students"
              icon={<Bell size={20} color="#fe6519" strokeWidth={2} />}
              onPress={() => handleQuickAction("announcement")}
            />
            <QuickAction
              title="Schedule Exam"
              description="Add new exam dates"
              icon={<Calendar size={20} color="#fe6519" strokeWidth={2} />}
              onPress={() => handleQuickAction("exam")}
            />
            <QuickAction
              title="Add Student"
              description="Register new student"
              icon={<Users size={20} color="#fe6519" strokeWidth={2} />}
              onPress={() => handleQuickAction("student")}
            />
            <QuickAction
              title="Update Timetable"
              description="Modify class schedules"
              icon={<Clock size={20} color="#fe6519" strokeWidth={2} />}
              onPress={() => handleQuickAction("timetable")}
            />
            <QuickAction
              title="Add results"
              description="Modify class schedules"
              icon={<Clock size={20} color="#fe6519" strokeWidth={2} />}
              onPress={() => handleQuickAction("results")}
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
                <Text style={styles.activityTitle}>New student enrolled</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Math exam scheduled</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Announcement published</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollView: { flex: 1 },
  header: { padding: 24, paddingTop: 60 },
  greeting: { fontSize: 16, color: "#666" },
  adminName: { fontSize: 28, fontWeight: "bold", color: "#000" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 16, gap: 16 },
  statCard: { flex: 1, minWidth: "45%", backgroundColor: "white", borderRadius: 16, padding: 16, borderLeftWidth: 4, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  statIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#000" },
  statTitle: { fontSize: 14, color: "#666", fontWeight: "500" },
  section: { padding: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 16 },
  quickActions: { gap: 12 },
  quickAction: { backgroundColor: "white", borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  quickActionIcon: { width: 48, height: 48, backgroundColor: "#FFF5E6", borderRadius: 24, justifyContent: "center", alignItems: "center", marginRight: 16 },
  quickActionContent: { flex: 1 },
  quickActionTitle: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 4 },
  quickActionDescription: { fontSize: 14, color: "#666" },
  activityCard: { backgroundColor: "white", borderRadius: 12, padding: 16, elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  activityItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fe6519", marginRight: 16 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: "500", color: "#000", marginBottom: 2 },
  activityTime: { fontSize: 12, color: "#666" },
});
