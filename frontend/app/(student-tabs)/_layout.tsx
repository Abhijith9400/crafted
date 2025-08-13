import { Tabs } from 'expo-router';
import { LayoutDashboard, Megaphone, Award, Play, User } from 'lucide-react-native';

export default function StudentTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fe6519',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 88,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <LayoutDashboard size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: 'News',
          tabBarIcon: ({ size, color }) => (
            <Megaphone size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: 'Videos',
          tabBarIcon: ({ size, color }) => (
            <Play size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: 'Results',
          tabBarIcon: ({ size, color }) => (
            <Award size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />

      {/* Hide About */}
      <Tabs.Screen
        name="about"
        options={{
          href: null,
        }}
      />

      {/* Hide Feedback */}
      <Tabs.Screen
        name="feedback"
        options={{
          href: null,
        }}
      />

      {/* Hide Timetable */}
      <Tabs.Screen
        name="timetable"
        options={{
          href: null,
        }}
      />
       <Tabs.Screen
        name="exam"
        options={{
          href: null,
        }}
      />
    </Tabs>
    
  );
}
