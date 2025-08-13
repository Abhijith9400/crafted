import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, User, Eye, EyeOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StudentLogin() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!studentId || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://192.168.1.34:5000/api/students/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, password })
      });

      const data = await res.json();
      setLoading(false);

     if (res.ok) {
  await AsyncStorage.setItem("studentId", data.student._id); // <-- store MongoDB _id
  console.log("Stored ID:", data.student._id);
  router.replace('/(student-tabs)/dashboard');
}
 else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <User size={48} color="#fe6519" strokeWidth={2} />
          </View>
          <Text style={styles.title}>Student Login</Text>
          <Text style={styles.subtitle}>Access your courses and results</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Student ID</Text>
            <TextInput
              style={styles.input}
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Enter your student ID"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  backButton: {
    position: 'absolute', top: 60, left: 24, zIndex: 1,
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
  },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  iconContainer: {
    width: 80, height: 80, backgroundColor: '#FFF5E6',
    borderRadius: 40, justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  form: { gap: 24 },
  inputContainer: { gap: 8 },
  label: { fontSize: 16, fontWeight: '600', color: '#000' },
  input: {
    borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 12,
    padding: 16, fontSize: 16, backgroundColor: 'white',
  },
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: '#E5E5E5',
    borderRadius: 12, backgroundColor: 'white',
  },
  passwordInput: { flex: 1, padding: 16, fontSize: 16 },
  eyeButton: { padding: 16 },
  loginButton: {
    backgroundColor: '#fe6519', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 8,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
});
