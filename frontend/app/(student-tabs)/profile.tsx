import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { User, Mail, Phone, Calendar, BookOpen, LogOut, Edit3 } from 'lucide-react-native';

export default function StudentProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://crafted-1.onrender.com/api/students";

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const id = await AsyncStorage.getItem("studentId"); // Fetch stored student ID
      if (!id) {
        Alert.alert("Error", "No student ID found in storage");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${BASE_URL}/${id}`);
      setProfileData(res.data);
      setEditData(res.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Save updated profile
  const handleSave = async () => {
    try {
      const id = await AsyncStorage.getItem("studentId");
      const res = await axios.patch(`${BASE_URL}/${id}`, editData);
      setProfileData(res.data.student || res.data);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/');
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fe6519" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.loader}>
        <Text>No profile data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <Text style={styles.editButtonText}>Cancel</Text>
          ) : (
            <Edit3 size={20} color="#fe6519" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <User size={48} color="#fe6519" strokeWidth={2} />
            </View>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.studentId}>ID: {profileData.studentId}</Text>
          </View>

          {/* Email */}
          <InfoField
            label="Email"
            icon={<Mail size={20} color="#666" />}
            value={editData.email}
            isEditing={isEditing}
            onChange={(text) => setEditData(prev => ({ ...prev, email: text }))}
          />

          {/* Phone */}
          <InfoField
            label="Phone"
            icon={<Phone size={20} color="#666" />}
            value={editData.phone}
            isEditing={isEditing}
            onChange={(text) => setEditData(prev => ({ ...prev, phone: text }))}
          />

          {/* Course */}
          <StaticField
            label="Current Course"
            icon={<BookOpen size={20} color="#666" />}
            value={profileData.course}
          />

          {/* Join Date */}
          <StaticField
            label="Join Date"
            icon={<Calendar size={20} color="#666" />}
            value={profileData.createdAt?.split("T")[0]}
          />

          {/* Edit Actions */}
          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#F44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoField({ label, icon, value, isEditing, onChange }) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={value}
            onChangeText={onChange}
          />
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}
      </View>
    </View>
  );
}

function StaticField({ label, icon, value }) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  editButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  editButtonText: { fontSize: 14, fontWeight: '600', color: '#F44336' },
  content: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileCard: { backgroundColor: 'white', borderRadius: 16, padding: 24, marginBottom: 16 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, backgroundColor: '#FFF5E6', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  studentId: { fontSize: 14, color: '#666', fontWeight: '500' },
  infoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  infoIcon: { width: 40, height: 40, backgroundColor: '#F8F9FA', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#000' },
  editInput: { borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 8, padding: 8, fontSize: 16, color: '#000', backgroundColor: 'white' },
  editActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelButton: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#666' },
  saveButton: { flex: 1, backgroundColor: '#fe6519', borderRadius: 8, padding: 12, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, gap: 8 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#F44336' }
});
