  import React, { useState, useEffect } from 'react';
  import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
  import { StatusBar } from 'expo-status-bar';
  import { Plus, Edit3, Trash2, Clock, Users, Youtube } from 'lucide-react-native';
  import YoutubePlayer from "react-native-youtube-iframe";

  interface Course {
    _id: string;
    name: string;
    description: string;
    duration: string;
    students: number;
    color: string;
    videoUrl?: string;
  }

  const API_URL = 'https://crafted-1.onrender.com/api/courses'; // <-- Change to your backend

  export default function AdminCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      duration: '',
      color: '#2196F3',
      videoUrl: '',
    });

    const courseColors = ['#2196F3', '#4CAF50', '#9C27B0', '#FF5722', '#607D8B'];

    // Fetch courses
    const fetchCourses = async () => {
      try {
        const res = await fetch('https://crafted-1.onrender.com/api/courses');
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    useEffect(() => {
      fetchCourses();
    }, []);

    // Save course
    const handleSave = async () => {
      if (!formData.name || !formData.description || !formData.duration) {
        Alert.alert('Validation', 'Please fill all required fields.');
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        duration: formData.duration,
        color: formData.color,
        videoUrl: formData.videoUrl,
      };

      try {
        if (editingId) {
          await fetch(`${API_URL}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } else {
          await fetch('https://crafted-1.onrender.com/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
        fetchCourses();
        resetForm();
      } catch (error) {
        console.error('Error saving course:', error);
      }
    };

    // Edit course
    const handleEdit = (course: Course) => {
      setFormData({
        name: course.name,
        description: course.description,
        duration: course.duration,
        color: course.color,
        videoUrl: course.videoUrl || '',
      });
      setEditingId(course._id);
      setModalVisible(true);
    };

    // Delete course
    const handleDelete = async (id: string) => {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    };

    // Reset form
    const resetForm = () => {
      setFormData({ name: '', description: '', duration: '', color: '#2196F3', videoUrl: '' });
      setEditingId(null);
      setModalVisible(false);
    };

    return (
      <View style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <Text style={styles.title}>Manage Courses</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {courses.map((course) => (
            <View key={course._id} style={styles.courseCard}>
              <View style={[styles.courseColorBar, { backgroundColor: course.color }]} />

              <View style={styles.courseContent}>
                <View style={styles.courseHeader}>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(course)}>
                      <Edit3 size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(course._id)}>
                      <Trash2 size={16} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.courseDescription}>{course.description}</Text>

                {course.videoUrl ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Youtube size={16} color="#FF0000" />
                    <Text style={{ fontSize: 12, color: '#007BFF', marginLeft: 6 }}>
                      YouTube Video Added
                    </Text>
                  </View>
                ) : null}

                <View style={styles.courseStats}>
                  <View style={styles.statItem}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.statText}>{course.duration}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users size={16} color="#666" />
                    <Text style={styles.statText}>{course.students || 0} students</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          
        </ScrollView>

        {/* Modal Form */}
        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={resetForm}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Course' : 'Create Course'}</Text>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Course Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                    placeholder="Enter course name"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
                    placeholder="Enter course description"
                    multiline
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Duration</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.duration}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, duration: text }))}
                    placeholder="e.g., 6 months"
                  />
                </View>

                {/* New Video URL Field */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>YouTube Video URL</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.videoUrl}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, videoUrl: text }))}
                    placeholder="Paste YouTube video link"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Color</Text>
                  <View style={styles.colorPicker}>
                    {courseColors.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          formData.color === color && styles.colorOptionSelected,
                        ]}
                        onPress={() => setFormData((prev) => ({ ...prev, color }))}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>{editingId ? 'Update' : 'Create'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
      </View>
      
    );
  }

  const styles = StyleSheet.create({
    // same as before, unchanged except for new input
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: 'white' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
    addButton: { backgroundColor: '#fe6519', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    content: { flex: 1, padding: 16 },
    courseCard: { backgroundColor: 'white', borderRadius: 12, marginBottom: 16, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, overflow: 'hidden' },
    courseColorBar: { height: 4, width: '100%' },
    courseContent: { padding: 16 },
    courseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    courseName: { fontSize: 18, fontWeight: 'bold', color: '#000', flex: 1 },
    actionButtons: { flexDirection: 'row', gap: 8 },
    actionButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
    courseDescription: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 12 },
    courseStats: { flexDirection: 'row', gap: 16 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statText: { fontSize: 12, color: '#666', fontWeight: '500' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, maxHeight: '80%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 24, textAlign: 'center' },
    form: { gap: 16 },
    inputContainer: { gap: 8 },
    label: { fontSize: 16, fontWeight: '600', color: '#000' },
    input: { borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 8, padding: 12, fontSize: 14, backgroundColor: 'white' },
    textArea: { height: 80, textAlignVertical: 'top' },
    colorPicker: { flexDirection: 'row', gap: 12 },
    colorOption: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
    colorOptionSelected: { borderColor: '#000' },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
    cancelButton: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 8, padding: 16, alignItems: 'center' },
    cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#666' },
    saveButton: { flex: 1, backgroundColor: '#fe6519', borderRadius: 8, padding: 16, alignItems: 'center' },
    saveButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
  });
