import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Calendar, FileText, Users } from "lucide-react-native";

interface ExamEntry {
  _id: string;
  title: string;
  date: string;
  targetType: "batch" | "student";
  targetValue: string;
  fileName: string;
}

const API_URL = "https://crafted-1.onrender.com/exams";

export default function StudentExams() {
  const [exams, setExams] = useState<ExamEntry[]>([]);

  const fetchExams = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setExams(data);
    } catch (err) {
      console.error("Error fetching exams:", err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleViewPDF = async (fileName: string) => {
    const pdfUrl = `https://crafted-1.onrender.com/uploads/${fileName}`;
    try {
      await WebBrowser.openBrowserAsync(pdfUrl);
    } catch (error) {
      console.error("Failed to open PDF:", error);
      alert("Unable to open PDF");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scheduled Exams</Text>
      <ScrollView style={styles.content}>
        {exams.length === 0 ? (
          <Text style={styles.noData}>No exams scheduled</Text>
        ) : (
          exams.map((exam) => (
            <View key={exam._id} style={styles.card}>
              <Text style={styles.examTitle}>{exam.title}</Text>

              <View style={styles.row}>
                <Calendar size={16} color="#666" />
                <Text style={styles.text}>{exam.date}</Text>
              </View>

              <View style={styles.row}>
                <Users size={16} color="#666" />
                <Text style={styles.text}>
                  {exam.targetType === "batch"
                    ? `Batch: ${exam.targetValue}`
                    : `Student ID: ${exam.targetValue}`}
                </Text>
              </View>

              <View style={styles.row}>
                <FileText size={16} color="#666" />
                <Text style={styles.text}>{exam.fileName}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleViewPDF(exam.fileName)}
                style={styles.viewButton}
              >
                <Text style={styles.viewButtonText}>View PDF</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", paddingTop: 50 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 12, paddingHorizontal: 16 },
  content: { padding: 16 },
  noData: { textAlign: "center", color: "#999", marginTop: 20 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  examTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 6 },
  text: { fontSize: 14, color: "#666" },
  viewButton: {
    marginTop: 10,
    backgroundColor: "#fe6519",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  viewButtonText: { color: "white", fontWeight: "600" },
});
