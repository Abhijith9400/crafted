import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { Plus, Edit3, Trash2 } from "lucide-react-native";

const API_URL = "https://crafted-1.onrender.com/api/timetable";

interface TimetableEntry {
  _id: string; // use _id because MongoDB uses _id
  day: string;
  time: string;
  subject: string;
  teacher: string;
}

const TimetableScreen = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [form, setForm] = useState({
    day: "",
    time: "",
    subject: "",
    teacher: "",
  });

  const fetchTimetable = async () => {
    try {
      const res = await axios.get(API_URL);
      setEntries(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({ day: "", time: "", subject: "", teacher: "" });
    setEditingEntry(null);
    setModalVisible(false);
  };

  const handleSave = async () => {
    try {
      if (editingEntry) {
        // EDIT existing entry
        const res = await axios.put(`${API_URL}/${editingEntry._id}`, form);
        setEntries((prev) =>
          prev.map((e) => (e._id === editingEntry._id ? res.data : e))
        );
      } else {
        // ADD new entry
        const res = await axios.post(API_URL, form);
        setEntries((prev) => [...prev, res.data]);
      }
      resetForm();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${id}`);
            setEntries((prev) => prev.filter((e) => e._id !== id));
          } catch (err) {
            console.error("Delete error:", err);
          }
        },
      },
    ]);
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setForm({
      day: entry.day,
      time: entry.time,
      subject: entry.subject,
      teacher: entry.teacher,
    });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timetable</Text>
      <ScrollView style={{ flex: 1 }}>
        {entries.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No classes scheduled
          </Text>
        )}
        {entries.map((entry) => (
          <View key={entry._id} style={styles.card}>
            <Text style={styles.text}>
              <Text style={styles.label}>Day:</Text> {entry.day}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Time:</Text> {entry.time}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Subject:</Text> {entry.subject}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Teacher:</Text> {entry.teacher}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(entry)}>
                <Edit3 size={22} color="#007bff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(entry._id)}>
                <Trash2 size={22} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingEntry(null);
          setForm({ day: "", time: "", subject: "", teacher: "" });
          setModalVisible(true);
        }}
      >
        <Plus size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingEntry ? "Edit" : "Add"} Entry
            </Text>
            {["day", "time", "subject", "teacher"].map((field) => (
              <TextInput
                key={field}
                placeholder={field.toUpperCase()}
                value={(form as any)[field]}
                onChangeText={(text) => handleInputChange(field, text)}
                style={styles.input}
              />
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={resetForm}>
                <Text style={styles.cancelBtn}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.saveBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimetableScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#f7f7f7", paddingHorizontal: 15 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15, color: "#333" },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 12, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  text: { fontSize: 16, marginVertical: 2 },
  label: { fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 15, marginTop: 10 },
  addButton: { position: "absolute", right: 20, bottom: 30, backgroundColor: "#fe6519", borderRadius: 30, padding: 14, elevation: 5 },
  modalContainer: { flex: 1, backgroundColor: "#c3bfb9ff", justifyContent: "center", paddingHorizontal: 20 },
  modalBox: { backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 10, borderRadius: 6 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  cancelBtn: { color: "#888", fontWeight: "bold" },
  saveBtn: { color: "#000", fontWeight: "bold" },
});
