import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, User } from 'lucide-react-native';

// Import your SVG logo
import { Image } from 'react-native'
export default function LoginSelection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#FF8C00', '#fe6519']} style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
  <Image
    source={require('../assets/images/logo.png')}
    style={styles.logo}
    resizeMode="contain"
  />
</View>

          <Text style={styles.title}>Crafted Learning Hub</Text>
          <Text style={styles.subtitle}>Choose your login type</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/admin-login')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Shield size={28} color="#fe6519" strokeWidth={2} />
              <Text style={styles.buttonText}>Admin Login</Text>
              <Text style={styles.buttonSubtext}>Manage students & courses</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/student-login')}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <User size={28} color="#fe6519" strokeWidth={2} />
              <Text style={styles.buttonText}>Student Login</Text>
              <Text style={styles.buttonSubtext}>Access your courses & results</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Crafted Learning Hub</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, justifyContent: 'space-between', padding: 24 },
  header: { alignItems: 'center', marginTop: 80 },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 18, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' },
  buttonContainer: { gap: 16 },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logo: {
  width: '80%',   // Fill most of the container
  height: '80%',
},

  buttonContent: { alignItems: 'center', gap: 8 },
  buttonText: { fontSize: 20, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  buttonSubtext: { fontSize: 14, color: '#666', textAlign: 'center' },
  footer: { alignItems: 'center', marginBottom: 40 },
  footerText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 },
});
