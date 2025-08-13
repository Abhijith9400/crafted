import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MessageSquare, Star, Send, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function StudentFeedback() {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Teaching Quality',
    'Course Content',
    'Facilities',
    'Staff Behavior',
    'Timetable',
    'Other',
  ];

  const handleSubmit = () => {
    if (!category || !feedback || rating === 0) {
      Alert.alert('Error', 'Please fill in all fields and provide a rating');
      return;
    }

    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setCategory('');
        setFeedback('');
      }, 2000);
    }, 500);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={64} color="#4CAF50" strokeWidth={2} />
          </View>
          <Text style={styles.successTitle}>Feedback Submitted!</Text>
          <Text style={styles.successMessage}>
            Thank you for your feedback. It helps us improve our services.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Feedback</Text>
        <Text style={styles.subtitle}>Help us improve your experience</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.feedbackCard}>
          <View style={styles.iconHeader}>
            <View style={styles.iconContainer}>
              <MessageSquare size={32} color="#fe6519" strokeWidth={2} />
            </View>
            <Text style={styles.cardTitle}>Share Your Thoughts</Text>
            <Text style={styles.cardSubtitle}>
              Your feedback is valuable to us and helps improve our teaching methods
            </Text>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.sectionLabel}>Overall Rating</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Star
                    size={32}
                    color={star <= rating ? '#fe6519' : '#E5E5E5'}
                    fill={star <= rating ? '#fe6519' : 'transparent'}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingText}>
                {rating === 1 ? 'Poor' :
                 rating === 2 ? 'Fair' :
                 rating === 3 ? 'Good' :
                 rating === 4 ? 'Very Good' : 'Excellent'}
              </Text>
            )}
          </View>

          <View style={styles.categorySection}>
            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.feedbackSection}>
            <Text style={styles.sectionLabel}>Your Feedback</Text>
            <TextInput
              style={styles.feedbackInput}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Please share your thoughts, suggestions, or concerns..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!category || !feedback || rating === 0) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!category || !feedback || rating === 0}
          >
            <Send size={20} color="white" strokeWidth={2} />
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why Your Feedback Matters</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Helps improve teaching methods</Text>
            <Text style={styles.infoItem}>• Enhances course content quality</Text>
            <Text style={styles.infoItem}>• Improves center facilities</Text>
            <Text style={styles.infoItem}>• Creates better learning environment</Text>
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
  feedbackCard: {
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
  iconHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF5E6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  ratingSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#fe6519',
    fontWeight: '600',
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    backgroundColor: '#fe6519',
    borderColor: '#fe6519',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextSelected: {
    color: 'white',
  },
  feedbackSection: {
    marginBottom: 24,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    backgroundColor: 'white',
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#fe6519',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});