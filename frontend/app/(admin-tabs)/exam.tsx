import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { Plus, Edit3, Trash2, Calendar, FileText, Users } from "lucide-react-native";

// Use your backend's IP (replace localhost with machine IP if testing on a phone)
const API_URL = "https://crafted-1.onrender.com/exams";

interface ExamEntry {
  _id: string;
  title: string;
  date: string;
  targetType: "batch" | "student";
  targetValue: string;
  fileName: string;
}

export default function ScheduleExam() {
  const [exams, setExams] = useState<ExamEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    targetType: "batch" as "batch" | "student",
    targetValue: "",
    fileName: "",
    fileUri: "",
  });

  // Load exams from backend
  const fetchExams = async () => {
    try {
      const res = await axios.get(API_URL);
      setExams(res.data);
    } catch (err) {
      console.error("Fetch exams error:", err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // File picker
 const handlePickFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.type === "success") {
      // For new Expo API (assets array)
      const file = result.assets ? result.assets[0] : result;

      setFormData((prev) => ({
        ...prev,
        fileName: file.name || "Selected File",
        fileUri: file.uri,
      }));
    }
  } catch (error) {
    console.error("File pick error:", error);
  }
};


const handleSave = async () => {
  if (!formData.title || !formData.date || !formData.targetValue) {
    alert("Please fill all fields");
    return;
  }

  if (!editingId && !formData.fileUri) {
    alert("PDF file is required");
    return;
  }

  try {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("date", formData.date);
    form.append("targetType", formData.targetType);
    form.append("targetValue", formData.targetValue);

  const file = {
  uri: formData.fileUri,
  type: "application/pdf",
  name: formData.fileName || "exam.pdf",
};

form.append("file", file as unknown as Blob); // 👈 Alternative type fix


    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await axios.post(API_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    fetchExams();
    resetForm();
  } catch (err) {
    console.error("Upload error:", err);
    alert("Failed to upload PDF");
  }
};
const handleViewPDF = async (fileName: string) => {
  const pdfUrl = `https://crafted-1.onrender.com/uploads/${fileName}`;
  try {
    await WebBrowser.openBrowserAsync(pdfUrl);
  } catch (error) {
    console.error("Failed to open PDF:", error);
    alert("Unable to open PDF");
  }
};
  // Delete exam
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchExams();
    } catch (err) {
      console.error("Delete exam error:", err);
      alert("Failed to delete exam");
    }
  };

  // Edit exam
  const handleEdit = (exam: ExamEntry) => {
    setFormData({
      title: exam.title,
      date: exam.date,
      targetType: exam.targetType,
      targetValue: exam.targetValue,
      fileName: exam.fileName, // keep old file name
      fileUri: "", // no new file yet
    });
    setEditingId(exam._id);
    setModalVisible(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      targetType: "batch",
      targetValue: "",
      fileName: "",
      fileUri: "",
    });
    setEditingId(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Schedule Exam</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* List of Exams */}
      <ScrollView style={styles.content}>
        {exams.map((exam) => (
          <View key={exam._id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.examTitle}>{exam.title}</Text>
              <View style={styles.actions}>
               <TouchableOpacity
  onPress={() => handleViewPDF(exam.fileName)}
  style={{ marginTop: 8, backgroundColor: "#fe6519", padding: 10, borderRadius: 6, alignItems: "center" }}
>
  <Text style={{ color: "white", fontWeight: "600" }}>View PDF</Text>
</TouchableOpacity>
              </View>
            </View>

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
          </View>
        ))}
      </ScrollView>

      {/* Modal for Add/Edit */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Exam" : "Add Exam"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Exam Title"
              value={formData.title}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, date: text }))}
            />

            {/* Target Selection */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, formData.targetType === "batch" && styles.toggleButtonActive]}
                onPress={() => setFormData((prev) => ({ ...prev, targetType: "batch" }))}
              >
                <Text style={[styles.toggleButtonText, formData.targetType === "batch" && styles.toggleButtonTextActive]}>
                  Batch
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, formData.targetType === "student" && styles.toggleButtonActive]}
                onPress={() => setFormData((prev) => ({ ...prev, targetType: "student" }))}
              >
                <Text style={[styles.toggleButtonText, formData.targetType === "student" && styles.toggleButtonTextActive]}>
                  Student ID
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={formData.targetType === "batch" ? "Enter Batch Name" : "Enter Student ID"}
              value={formData.targetValue}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, targetValue: text }))}
            />

            {/* File Picker */}
            <TouchableOpacity style={styles.fileButton} onPress={handlePickFile}>
              <FileText size={16} color="#fe6519" />
              <Text style={{ marginLeft: 8, color: "#fe6519" }}>
                {formData.fileName ? formData.fileName : "Upload Question Paper (PDF)"}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{editingId ? "Update" : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 60,
    backgroundColor: "white",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#000" },
  addButton: {
    backgroundColor: "#fe6519",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: { padding: 16 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  examTitle: { fontSize: 16, fontWeight: "bold" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 6 },
  text: { fontSize: 14, color: "#666" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "white", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  toggleContainer: { flexDirection: "row", marginBottom: 12, gap: 8 },
  toggleButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonActive: { backgroundColor: "#fe6519" },
  toggleButtonText: { color: "#666", fontWeight: "600" },
  toggleButtonTextActive: { color: "white" },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#fe6519",
    borderRadius: 8,
    marginBottom: 12,
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 10 },
  cancelButton: { flex: 1, backgroundColor: "#F5F5F5", padding: 14, borderRadius: 8, alignItems: "center" },
  cancelButtonText: { color: "#666", fontWeight: "600" },
  saveButton: { flex: 1, backgroundColor: "#fe6519", padding: 14, borderRadius: 8, alignItems: "center" },
  saveButtonText: { color: "white", fontWeight: "600" },
});
