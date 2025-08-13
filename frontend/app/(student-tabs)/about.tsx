import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GraduationCap, MapPin, Phone, Mail, Clock, Award, Users, Star } from 'lucide-react-native';

export default function AboutTuitionCenter() {
  const handleContact = (type: 'phone' | 'email') => {
    if (type === 'phone') {
      Linking.openURL('+91 7356324680');
    } else {
      Linking.openURL('hello@craftedlearn.com');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.subtitle}>Crafted Learning hub</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.logoContainer}>
              <GraduationCap size={48} color="white" strokeWidth={2} />
            </View>
            <Text style={styles.heroTitle}>Crafted Learning hub</Text>
            <Text style={styles.heroSubtitle}>Empowering Future Leaders</Text>
          </View>
        </View>

        <View style={styles.missionCard}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            At Crafted learning hub, we are committed to providing high-quality education that 
            empowers students to achieve their academic goals and reach their full potential. 
            Our experienced faculty and modern teaching methods ensure every student receives 
            personalized attention and support.
          </Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Our Achievements</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Users size={24} color="#2196F3" strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>100+</Text>
              <Text style={styles.statLabel}>Students </Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Award size={24} color="#4CAF50" strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>99.9%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Clock size={24} color="#fe6519" strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>10+</Text>
              <Text style={styles.statLabel}>Years Experience</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Star size={24} color="#9C27B0" strokeWidth={2} />
              </View>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>👨‍🏫</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Expert Faculty</Text>
                <Text style={styles.featureDescription}>
                  Experienced teachers with advanced degrees and proven track records
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📱</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Modern Technology</Text>
                <Text style={styles.featureDescription}>
                  Interactive whiteboards, online resources, and digital learning tools
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>👥</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Small Class Sizes</Text>
                <Text style={styles.featureDescription}>
                  Maximum 15 students per class for personalized attention
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📈</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Progress Tracking</Text>
                <Text style={styles.featureDescription}>
                  Regular assessments and detailed progress reports
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <MapPin size={20} color="#666" strokeWidth={2} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>
                  Kerala , India
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleContact('phone')}
            >
              <View style={styles.contactIcon}>
                <Phone size={20} color="#666" strokeWidth={2} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={[styles.contactValue, styles.contactLink]}>
                  +91 7356324680
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleContact('email')}
            >
              <View style={styles.contactIcon}>
                <Mail size={20} color="#666" strokeWidth={2} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={[styles.contactValue, styles.contactLink]}>
                  hello@craftedlearn.com
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Clock size={20} color="#666" strokeWidth={2} />
              </View>
              <View style={styles.contactContent}>
                <Text style={styles.contactLabel}>Hours</Text>
                <Text style={styles.contactValue}>
                  Monday - Saturday{'\n'}8:00 AM - 8:00 PM
                </Text>
              </View>
            </View>
          </View>
        </View>
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
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  heroCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  missionCard: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  missionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  featuresCard: {
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
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureEmoji: {
    fontSize: 32,
    width: 48,
    textAlign: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  contactInfo: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  contactLink: {
    color: '#fe6519',
    fontWeight: '500',
  },
});