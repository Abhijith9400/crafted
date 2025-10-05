import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react-native';
import axios from 'axios';

interface ExamResult {
  _id: string;
  studentId: string;
  subject: string;
  examType: string;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
  trend: 'up' | 'down' | 'same';
}

const API_URL = 'https://crafted-1.onrender.com/api/results';

export default function StudentResults() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentResults = async () => {
    try {
      const studentId = await AsyncStorage.getItem('studentId');
      if (!studentId) {
        console.warn('No student ID found');
        setResults([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/student/${studentId}`);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentResults();
  }, []);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return '#4CAF50';
    if (grade.startsWith('B')) return '#fe6519';
    if (grade.startsWith('C')) return '#FF9800';
    return '#F44336';
  };

  const getSubjectColor = (subject: string) => {
    if (subject.includes('Math')) return '#2196F3';
    if (subject.includes('Physics')) return '#4CAF50';
    if (subject.includes('Chemistry')) return '#9C27B0';
    return '#666';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} color="#4CAF50" strokeWidth={2} />;
      case 'down': return <TrendingDown size={16} color="#F44336" strokeWidth={2} />;
      case 'same': return <Minus size={16} color="#666" strokeWidth={2} />;
      default: return null;
    }
  };

  const calculateOverallStats = () => {
    if (!results.length) return { overall: 0, subjects: [] };

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalMax = results.reduce((sum, r) => sum + r.maxScore, 0);
    const overall = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;

    const subjectMap = results.reduce((acc, r) => {
      if (!acc[r.subject]) acc[r.subject] = { total: 0, count: 0 };
      acc[r.subject].total += (r.score / r.maxScore) * 100;
      acc[r.subject].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const subjects = Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      average: Math.round(data.total / data.count),
    }));

    return { overall, subjects };
  };

  const stats = calculateOverallStats();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fe6519" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>My Results</Text>

      {/* Overall Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Overall Performance</Text>
        <View style={styles.overallScore}>
          <Text style={styles.scoreValue}>{stats.overall}%</Text>
          <Text style={styles.scoreLabel}>Average Score</Text>
        </View>

        <View style={styles.subjectStats}>
          {stats.subjects.map((s) => (
            <View key={s.subject} style={styles.subjectStat}>
              <View style={[styles.subjectDot, { backgroundColor: getSubjectColor(s.subject) }]} />
              <Text style={styles.subjectStatName}>{s.subject}</Text>
              <Text style={styles.subjectStatScore}>{s.average}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Individual Results */}
      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>Recent Results</Text>
        {results.length === 0 ? (
          <Text>No results available</Text>
        ) : (
          results.map((r) => (
            <View key={r._id} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.subjectContainer}>
                  <View style={[styles.subjectIndicator, { backgroundColor: getSubjectColor(r.subject) }]} />
                  <View>
                    <Text style={styles.resultSubject}>{r.subject}</Text>
                    <Text style={styles.examType}>{r.examType}</Text>
                  </View>
                </View>
                <View style={styles.trendContainer}>{getTrendIcon(r.trend)}</View>
              </View>

              <View style={styles.scoreContainer}>
                <View style={styles.scoreInfo}>
                  <Text style={styles.score}>{r.score}/{r.maxScore}</Text>
                  <Text style={styles.percentage}>({Math.round((r.score / r.maxScore) * 100)}%)</Text>
                </View>
                <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(r.grade) }]}>
                  <Text style={styles.gradeText}>{r.grade}</Text>
                </View>
              </View>

              <View style={styles.resultFooter}>
                <View style={styles.dateContainer}>
                  <Calendar size={14} color="#666" strokeWidth={2} />
                  <Text style={styles.dateText}>{r.date?.slice(0, 10)}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 16, textAlign: 'center' },
  statsCard: { backgroundColor: 'white', borderRadius: 16, padding: 24, marginBottom: 24, elevation: 1 },
  statsTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 16, textAlign: 'center' },
  overallScore: { alignItems: 'center', marginBottom: 24 },
  scoreValue: { fontSize: 48, fontWeight: 'bold', color: '#fe6519', marginBottom: 4 },
  scoreLabel: { fontSize: 14, color: '#666' },
  subjectStats: { gap: 12 },
  subjectStat: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subjectDot: { width: 12, height: 12, borderRadius: 6 },
  subjectStatName: { flex: 1, fontSize: 14, fontWeight: '500', color: '#000' },
  subjectStatScore: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  resultsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 16 },
  resultCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  subjectContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  subjectIndicator: { width: 4, height: 40, borderRadius: 2 },
  resultSubject: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 2 },
  examType: { fontSize: 12, color: '#666' },
  trendContainer: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  scoreContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  scoreInfo: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  score: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  percentage: { fontSize: 14, color: '#666' },
  gradeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  gradeText: { fontSize: 14, fontWeight: 'bold', color: 'white' },
  resultFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 12, color: '#666' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
