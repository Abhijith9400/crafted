import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

// Define the type for one entry
interface TimetableEntry {
  _id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
}

// Allowed days
type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

// Timetable structure
type Timetable = Record<Day, TimetableEntry[]>;

const TimetableScreen: React.FC = () => {
  const [timetable, setTimetable] = useState<Timetable>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });

  useEffect(() => {
    fetch("https://crafted-1.onrender.com/api/timetable") // change URL to your API
      .then((res) => res.json())
      .then((data: TimetableEntry[]) => {
        const grouped: Timetable = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
        };

        data.forEach((entry) => {
          const dayKey = entry.day.trim().toLowerCase() as Day;
          if (grouped[dayKey]) {
            grouped[dayKey].push(entry);
          }
        });

        // sort by time (ascending)
        (Object.keys(grouped) as Day[]).forEach((day) => {
          grouped[day].sort((a, b) => Number(a.time) - Number(b.time));
        });

        setTimetable(grouped);
      })
      .catch((err) => console.error("Error fetching timetable:", err));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Timetable</Text>

      {(Object.keys(timetable) as Day[]).map((day) => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Text>

          {timetable[day].length > 0 ? (
            timetable[day].map((item) => (
              <Text key={item._id} style={styles.classText}>
                {item.time} - {item.subject} ({item.teacher})
              </Text>
            ))
          ) : (
            <Text style={styles.noClass}>No classes</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  dayContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  classText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  noClass: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
  },
});

export default TimetableScreen;
