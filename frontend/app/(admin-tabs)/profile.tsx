import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, MapPin, Settings, LogOut, Shield } from 'lucide-react-native';
import axios from 'axios';

interface Stats {
  totalStudents: number;
  activeCourses: number;
  announcements: number;
  upcomingExams: number;
}

export default function AdminProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Admin',
    email: 'hello@craftedlearn.com',
    phone: '+91 7356324680',
    address: 'Kerala, India',
    position: 'Center Administrator',
  });

  const [editData, setEditData] = useState(profileData);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
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
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/') },
      ]
    );
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://crafted-1.onrender.com/api/stats'); // Replace with your API URL
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      Alert.alert('Error', 'Unable to fetch statistics.');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Admin Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setIsEditing(!isEditing)}>
          <Settings size={20} color="#666" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Shield size={48} color="#fe6519" strokeWidth={2} />
            </View>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.position}>{profileData.position}</Text>
          </View>

          <View style={styles.infoSection}>
            {[
              { label: 'Email', icon: <Mail size={20} color="#666" strokeWidth={2} />, key: 'email', keyboard: 'email-address' },
              { label: 'Phone', icon: <Phone size={20} color="#666" strokeWidth={2} />, key: 'phone', keyboard: 'phone-pad' },
              { label: 'Address', icon: <MapPin size={20} color="#666" strokeWidth={2} />, key: 'address', keyboard: 'default', multiline: true },
            ].map((item) => (
              <View style={styles.infoItem} key={item.key}>
                <View style={styles.infoIcon}>{item.icon}</View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.editInput, item.multiline && styles.addressInput]}
                      value={editData[item.key as keyof typeof editData]}
                      onChangeText={(text) => setEditData(prev => ({ ...prev, [item.key]: text }))}
                      keyboardType={item.keyboard as any}
                      multiline={item.multiline}
                      numberOfLines={item.multiline ? 2 : 1}
                    />
                  ) : (
                    <Text style={styles.infoValue}>{profileData[item.key as keyof typeof profileData]}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

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

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Admin Statistics</Text>
          {loadingStats ? (
            <ActivityIndicator size="large" color="#fe6519" style={{ marginVertical: 16 }} />
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.totalStudents || 0}</Text>
                <Text style={styles.statLabel}>Students Managed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.activeCourses || 0}</Text>
                <Text style={styles.statLabel}>Active Courses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.announcements || 0}</Text>
                <Text style={styles.statLabel}>Announcements</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.upcomingExams || 0}</Text>
                <Text style={styles.statLabel}>Exams Scheduled</Text>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#F44336" strokeWidth={2} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF5E6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: 'white',
  },
  addressInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#fe6519',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fe6519',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
});