import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'https://crafted-1.onrender.com/api/results';

interface Result {
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

export default function AdminResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Result>>({});
  const [editId, setEditId] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      const res = await axios.get(API_URL);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!form.studentId || !form.subject || !form.examType || form.score == undefined || form.maxScore == undefined) {
        Alert.alert('Error', 'Please fill required fields');
        return;
      }

      if (editId) {
        await axios.put(`${API_URL}/edit/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API_URL}/add`, form);
      }

      setForm({});
      fetchResults();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      fetchResults();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete');
    }
  };

  const handleEdit = (result: Result) => {
    setForm(result);
    setEditId(result._id);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fe6519" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Admin - Manage Results</Text>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Student ID"
          value={form.studentId || ''}
          onChangeText={(val) => handleChange('studentId', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Subject"
          value={form.subject || ''}
          onChangeText={(val) => handleChange('subject', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Exam Type"
          value={form.examType || ''}
          onChangeText={(val) => handleChange('examType', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Score"
          keyboardType="numeric"
          value={form.score?.toString() || ''}
          onChangeText={(val) => handleChange('score', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Max Score"
          keyboardType="numeric"
          value={form.maxScore?.toString() || ''}
          onChangeText={(val) => handleChange('maxScore', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Grade"
          value={form.grade || ''}
          onChangeText={(val) => handleChange('grade', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={form.date?.slice(0, 10) || ''}
          onChangeText={(val) => handleChange('date', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Trend (up / down / same)"
          value={form.trend || ''}
          onChangeText={(val) => handleChange('trend', val)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{editId ? 'Update' : 'Add'} Result</Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      <View style={styles.list}>
        {results.map((r) => (
          <View key={r._id} style={styles.resultCard}>
            <Text style={styles.resultText}>Student ID: {r.studentId}</Text>
            <Text style={styles.resultText}>Subject: {r.subject}</Text>
            <Text style={styles.resultText}>Exam Type: {r.examType}</Text>
            <Text style={styles.resultText}>
              Score: {r.score} / {r.maxScore}
            </Text>
            <Text style={styles.resultText}>Grade: {r.grade}</Text>
            <Text style={styles.resultText}>Date: {r.date?.slice(0, 10)}</Text>
            <Text style={styles.resultText}>Trend: {r.trend}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(r)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(r._id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#000' },
  form: { marginBottom: 24 },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  button: {
    backgroundColor: '#fe6519',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  list: { marginBottom: 24 },
  resultCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  resultText: { fontSize: 14, marginBottom: 4, color: '#000' },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  editButton: { marginRight: 12, padding: 8, backgroundColor: '#4CAF50', borderRadius: 6 },
  deleteButton: { padding: 8, backgroundColor: '#F44336', borderRadius: 6 },
  actionText: { color: 'white', fontWeight: 'bold' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
