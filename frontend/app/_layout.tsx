import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useFrameworkReady();

  useEffect(() => {
    // Simulate app readiness check (e.g., token check, API call)
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 500); // Small delay so it doesn't flash the not-found

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAppReady) {
      // Always go to login first
      router.replace('/');
    }
  }, [isAppReady]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* No default +not-found on startup */}
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
