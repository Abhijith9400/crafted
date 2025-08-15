import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Plus, Edit3, Trash2, User, Mail, Phone, Calendar
} from "lucide-react-native";

interface Student {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  createdAt: string;
  status: "active" | "inactive";
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    course: "",
    status: "active" as "active" | "inactive"
  });

  const courses = ["Advanced Mathematics", "Physics Fundamentals", "Chemistry Basics"];

  // Load students
  const fetchStudents = async () => {
    try {
      const res = await fetch("https://crafted-1.onrender.com/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Error loading students", err);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  // Save or Update
  const handleSave = async () => {
    if (!formData.studentId || !formData.name || !formData.email || !formData.course) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (!editingId && !formData.password) {
      Alert.alert("Error", "Password is required for new student");
      return;
    }

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `https://crafted-1.onrender.com/api/students/${editingId}`
        : "https://crafted-1.onrender.com/api/students";

      const payload = editingId
        ? { ...formData, ...(formData.password ? { password: formData.password } : {}) }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", editingId ? "Student updated" : "Student added");
        resetForm();
        fetchStudents();
      } else {
        Alert.alert("Error", data.message || "Failed to save student");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Network request failed");
    }
  };

  // Delete
  const handleDelete = (id: string) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Yes", onPress: async () => {
          try {
            await fetch(`https://crafted-1.onrender.com/api/students/${id}`, { method: "DELETE" });
            fetchStudents();
          } catch (err) {
            console.error("Delete failed", err);
          }
        }
      }
    ]);
  };

  // Start editing
  const handleEdit = (student: Student) => {
    setEditingId(student._id);
    setFormData({
      studentId: student.studentId,
      password: "",
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      status: student.status
    });
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      studentId: "", password: "", name: "",
      email: "", phone: "", course: "",
      status: "active"
    });
    setEditingId(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Manage Students</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {students.map((student) => (
          <View key={student._id} style={styles.studentCard}>
            <View style={styles.studentHeader}>
              <View style={styles.studentInfo}>
                <View style={styles.avatarContainer}>
                  <User size={24} color="#fe6519" />
                </View>
                <View>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentCourse}>{student.course}</Text>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEdit(student)}>
                  <Edit3 size={16} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(student._id)}>
                  <Trash2 size={16} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.contactInfo}>
              <Mail size={14} color="#666" /><Text>{student.email}</Text>
              <Phone size={14} color="#666" /><Text>{student.phone}</Text>
              <Calendar size={14} color="#666" /><Text>Joined: {student.createdAt?.split("T")[0]}</Text>
            </View>

            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: student.status === "active" ? "#4567a2ff" : "#F44336" }]}>
                <Text style={styles.statusText}>{student.status.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Student" : "Add Student"}
            </Text>
            <ScrollView>
              {[
                { label: "Student ID", key: "studentId" },
                { label: "Password", key: "password", secure: true },
                { label: "Full Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" }
              ].map(({ label, key, secure }) => (
                <View key={key} style={styles.inputContainer}>
                  <Text>{label}</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={secure}
                    value={formData[key as keyof typeof formData]}
                    onChangeText={(t) => setFormData((p) => ({ ...p, [key]: t }))}
                  />
                </View>
              ))}

              <View style={styles.inputContainer}>
                <Text>Course</Text>
                {courses.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setFormData((p) => ({ ...p, course: c }))}
                  >
                    <Text style={{ color: formData.course === c ? "orange" : "black" }}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={resetForm}><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSave}><Text>{editingId ? "Update" : "Add"}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles same as your existing
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 24, paddingTop: 60, backgroundColor: "white" },
  title: { fontSize: 24, fontWeight: "bold" },
  addButton: { backgroundColor: "#fe6519", width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  content: { padding: 16 },
  studentCard: { backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 16 },
  studentHeader: { flexDirection: "row", justifyContent: "space-between" },
  studentInfo: { flexDirection: "row", alignItems: "center" },
  avatarContainer: { backgroundColor: "#FFF5E6", padding: 8, borderRadius: 24, marginRight: 12 },
  studentName: { fontWeight: "bold" },
  studentCourse: { color: "#666" },
  actionButtons: { flexDirection: "row", gap: 8 },
  contactInfo: { marginTop: 8, gap: 4 },
  statusContainer: { marginTop: 8 },
  statusBadge: { padding: 4, borderRadius: 8 },
  statusText: { color: "white" },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", margin: 20, padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  inputContainer: { marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 8, borderRadius: 5 }
});
