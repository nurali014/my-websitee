import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LockGate } from '../components/LockGate';
import { fetchPremium, initPurchases, onPremiumChange } from '../lib/purchases';
import { StoreProvider, useStore } from '../state/store';
import { colors } from '../theme';

function PremiumSync() {
  const { ready, setPremium } = useStore();
  useEffect(() => {
    if (!ready || !initPurchases()) return;
    fetchPremium().then((p) => p !== null && setPremium(p));
    return onPremiumChange(setPremium);
  }, [ready, setPremium]);
  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <PremiumSync />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
          <Stack.Screen name="quit" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
        </Stack>
        <LockGate />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
