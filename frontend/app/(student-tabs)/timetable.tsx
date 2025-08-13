import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface ClassItem {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  color: string;
}

interface DaySchedule {
  [key: string]: ClassItem[];
}

export default function StudentTimetable() {
  const [selectedWeek, setSelectedWeek] = useState(0);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const schedule: DaySchedule = {
    Monday: [
      {
        time: '9:00 AM - 10:30 AM',
        subject: 'Advanced Mathematics',
        teacher: 'Dr. Johnson',
        room: 'Room 101',
        color: '#2196F3',
      },
      {
        time: '11:00 AM - 12:30 PM',
        subject: 'Physics Fundamentals',
        teacher: 'Prof. Williams',
        room: 'Lab 201',
        color: '#4CAF50',
      },
      {
        time: '2:00 PM - 3:30 PM',
        subject: 'Chemistry Basics',
        teacher: 'Dr. Anderson',
        room: 'Lab 301',
        color: '#9C27B0',
      },
    ],
    Tuesday: [
      {
        time: '10:00 AM - 11:30 AM',
        subject: 'Advanced Mathematics',
        teacher: 'Dr. Johnson',
        room: 'Room 101',
        color: '#2196F3',
      },
      {
        time: '1:00 PM - 2:30 PM',
        subject: 'Physics Fundamentals',
        teacher: 'Prof. Williams',
        room: 'Lab 201',
        color: '#4CAF50',
      },
    ],
    Wednesday: [
      {
        time: '9:00 AM - 10:30 AM',
        subject: 'Chemistry Basics',
        teacher: 'Dr. Anderson',
        room: 'Lab 301',
        color: '#9C27B0',
      },
      {
        time: '11:00 AM - 12:30 PM',
        subject: 'Advanced Mathematics',
        teacher: 'Dr. Johnson',
        room: 'Room 101',
        color: '#2196F3',
      },
      {
        time: '2:00 PM - 3:30 PM',
        subject: 'Physics Fundamentals',
        teacher: 'Prof. Williams',
        room: 'Lab 201',
        color: '#4CAF50',
      },
    ],
    Thursday: [
      {
        time: '10:00 AM - 11:30 AM',
        subject: 'Chemistry Basics',
        teacher: 'Dr. Anderson',
        room: 'Lab 301',
        color: '#9C27B0',
      },
      {
        time: '1:00 PM - 2:30 PM',
        subject: 'Advanced Mathematics',
        teacher: 'Dr. Johnson',
        room: 'Room 101',
        color: '#2196F3',
      },
    ],
    Friday: [
      {
        time: '9:00 AM - 10:30 AM',
        subject: 'Physics Fundamentals',
        teacher: 'Prof. Williams',
        room: 'Lab 201',
        color: '#4CAF50',
      },
      {
        time: '11:00 AM - 12:30 PM',
        subject: 'Chemistry Basics',
        teacher: 'Dr. Anderson',
        room: 'Lab 301',
        color: '#9C27B0',
      },
    ],
    Saturday: [
      {
        time: '10:00 AM - 11:30 AM',
        subject: 'Extra Practice Session',
        teacher: 'Multiple Teachers',
        room: 'Room 101',
        color: '#FF5722',
      },
    ],
  };

  const currentDate = new Date();
  const weekDates = daysOfWeek.map((_, index) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - currentDate.getDay() + 1 + index + (selectedWeek * 7));
    return date;
  });

  const formatDate = (date: Date) => {
    return date.getDate().toString();
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'short' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Timetable</Text>
        <View style={styles.weekNavigation}>
          <TouchableOpacity
            style={styles.weekButton}
            onPress={() => setSelectedWeek(selectedWeek - 1)}
          >
            <ChevronLeft size={20} color="#fe6519" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.weekText}>
            {selectedWeek === 0 ? 'This Week' : 
             selectedWeek === 1 ? 'Next Week' : 
             selectedWeek === -1 ? 'Last Week' : 
             `Week ${selectedWeek > 0 ? '+' + selectedWeek : selectedWeek}`}
          </Text>
          <TouchableOpacity
            style={styles.weekButton}
            onPress={() => setSelectedWeek(selectedWeek + 1)}
          >
            <ChevronRight size={20} color="#fe6519" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {daysOfWeek.map((day, index) => {
          const dayDate = weekDates[index];
          const classes = schedule[day] || [];
          
          return (
            <View key={day} style={styles.daySection}>
              <View style={styles.dayHeader}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{day}</Text>
                  <View style={[
                    styles.dateContainer,
                    isToday(dayDate) && styles.todayDateContainer
                  ]}>
                    <Text style={[
                      styles.dateText,
                      isToday(dayDate) && styles.todayDateText
                    ]}>
                      {formatDate(dayDate)} {formatMonth(dayDate)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.classCount}>
                  {classes.length} {classes.length === 1 ? 'class' : 'classes'}
                </Text>
              </View>

              {classes.length > 0 ? (
                <View style={styles.classesContainer}>
                  {classes.map((classItem, classIndex) => (
                    <View key={classIndex} style={styles.classCard}>
                      <View style={[styles.classColorBar, { backgroundColor: classItem.color }]} />
                      <View style={styles.classContent}>
                        <View style={styles.classHeader}>
                          <Text style={styles.classSubject}>{classItem.subject}</Text>
                          <View style={styles.timeContainer}>
                            <Clock size={14} color="#666" strokeWidth={2} />
                            <Text style={styles.classTime}>{classItem.time}</Text>
                          </View>
                        </View>
                        <View style={styles.classDetails}>
                          <View style={styles.teacherContainer}>
                            <User size={14} color="#666" strokeWidth={2} />
                            <Text style={styles.teacherName}>{classItem.teacher}</Text>
                          </View>
                          <Text style={styles.roomText}>{classItem.room}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noClassesContainer}>
                  <Text style={styles.noClassesText}>No classes scheduled</Text>
                </View>
              )}
            </View>
          );
        })}
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
    marginBottom: 16,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    borderRadius: 20,
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  dateContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  todayDateContainer: {
    backgroundColor: '#fe6519',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  todayDateText: {
    color: 'white',
  },
  classCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  classesContainer: {
    gap: 8,
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  classColorBar: {
    height: 4,
    width: '100%',
  },
  classContent: {
    padding: 12,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classTime: {
    fontSize: 12,
    color: '#fe6519',
    fontWeight: '600',
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teacherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  teacherName: {
    fontSize: 12,
    color: '#666',
  },
  roomText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  noClassesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  noClassesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});