import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Plus,
  CreditCard as Edit3,
  Trash2,
  Calendar,
} from "lucide-react-native";

interface Announcement {
  _id?: string;
  title: string;
  content: string;
  date: string;
  priority: "low" | "medium" | "high";
}

const API_URL = "https://crafted-1.onrender.com/api/announcements"; // ← Change YOUR_IP

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Save or update announcement
  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      Alert.alert("Validation", "Please fill all required fields.");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      fetchAnnouncements();
      resetForm();
    } catch (err) {
      console.error("Error saving announcement:", err);
    }
  };

  // Edit announcement
  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
    });
    setEditingId(announcement._id || null);
    setModalVisible(true);
  };

  // Delete announcement
  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchAnnouncements();
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ title: "", content: "", priority: "medium" });
    setEditingId(null);
    setModalVisible(false);
  };

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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={20} color="white" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {announcements.map((announcement) => (
          <View key={announcement._id} style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
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
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(announcement)}
                >
                  <Edit3 size={16} color="#666" strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    announcement._id && handleDelete(announcement._id)
                  }
                >
                  <Trash2 size={16} color="#F44336" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.announcementTitle}>{announcement.title}</Text>
            <Text style={styles.announcementContent}>
              {announcement.content}
            </Text>

            <View style={styles.announcementFooter}>
              <View style={styles.dateContainer}>
                <Calendar size={14} color="#666" strokeWidth={2} />
                <Text style={styles.dateText}>{announcement.date}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal for Create/Edit */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Announcement" : "Create Announcement"}
            </Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, title: text }))
                  }
                  placeholder="Enter announcement title"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Content</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.content}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, content: text }))
                  }
                  placeholder="Enter announcement content"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityButtons}>
                  {["low", "medium", "high"].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        formData.priority === priority &&
                          styles.priorityButtonActive,
                      ]}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: priority as any,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.priorityButtonText,
                          formData.priority === priority &&
                            styles.priorityButtonTextActive,
                        ]}
                      >
                        {priority.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {editingId ? "Update" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  content: { flex: 1, padding: 16 },
  announcementCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priorityContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: 12, fontWeight: "600", color: "#666" },
  actionButtons: { flexDirection: "row", gap: 8 },
  actionButton: { width: 32, height: 32, justifyContent: "center" },
  announcementTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  announcementContent: { fontSize: 14, color: "#666", marginBottom: 12 },
  announcementFooter: { flexDirection: "row", alignItems: "center" },
  dateContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 12, color: "#666" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 24 },
  form: { gap: 16 },
  inputContainer: { gap: 8 },
  label: { fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  priorityButtons: { flexDirection: "row", gap: 8 },
  priorityButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  priorityButtonActive: { backgroundColor: "#fe6519" },
  priorityButtonText: { fontSize: 12, fontWeight: "600", color: "#666" },
  priorityButtonTextActive: { color: "white" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 24 },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#666" },
  saveButton: {
    flex: 1,
    backgroundColor: "#fe6519",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: { fontSize: 16, fontWeight: "600", color: "white" },
});
