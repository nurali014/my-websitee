import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, Text, View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

import { Button, Card, Screen, styles } from '../components/ui';
import { buy, fetchPackages, purchasesAvailable, restore } from '../lib/purchases';
import { useStore } from '../state/store';
import { colors } from '../theme';

const PERKS = [
  'Hard Mode: a second, brutal challenge every day (+100 XP)',
  'Unlimited custom habits',
  '12 weeks of streak history',
  'Support an independent developer',
];

const TERMS_URL = process.env.EXPO_PUBLIC_TERMS_URL;
const PRIVACY_URL = process.env.EXPO_PUBLIC_PRIVACY_URL;

export default function Paywall() {
  const { data, setPremium } = useStore();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selected, setSelected] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchPackages()
      .then((p) => {
        setPackages(p);
        setSelected(p.find((x) => x.packageType === 'ANNUAL') ?? p[0] ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const run = async (action: () => Promise<boolean>, failMsg: string) => {
    setBusy(true);
    try {
      if (await action()) {
        setPremium(true);
        router.back();
      }
    } catch (e: any) {
      Alert.alert('Something went wrong', e?.message ?? failMsg);
    } finally {
      setBusy(false);
    }
  };

  if (data.premium) {
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
          <Text style={styles.title}>You’re Premium.</Text>
          <Text style={styles.body}>Everything is unlocked. Now go earn it.</Text>
        </View>
        <Button title="Close" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ alignSelf: 'flex-end' }}>
        <Ionicons name="close" size={28} color={colors.textDim} />
      </Pressable>
      <Text style={{ color: colors.gold, fontWeight: '900', letterSpacing: 3 }}>HARDMODE PREMIUM</Text>
      <Text style={styles.title}>Stop playing it safe.</Text>

      <Card>
        {PERKS.map((p) => (
          <View key={p} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <Ionicons name="checkmark-circle" size={20} color={colors.gold} />
            <Text style={[styles.body, { color: colors.text, flex: 1 }]}>{p}</Text>
          </View>
        ))}
      </Card>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}

      {packages.map((pkg) => {
        const on = selected?.identifier === pkg.identifier;
        return (
          <Pressable key={pkg.identifier} onPress={() => setSelected(pkg)}>
            <Card accent={on}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.h2, { fontSize: 18 }]}>{pkg.product.title}</Text>
                  {pkg.product.introPrice ? (
                    <Text style={[styles.body, { fontSize: 13 }]}>Intro: {pkg.product.introPrice.priceString}</Text>
                  ) : null}
                </View>
                <Text style={[styles.h2, { fontSize: 18 }]}>{pkg.product.priceString}</Text>
              </View>
            </Card>
          </Pressable>
        );
      })}

      {!loading && packages.length === 0 ? (
        <Card>
          <Text style={styles.body}>
            {purchasesAvailable()
              ? 'No subscription plans found. Check your RevenueCat offering setup.'
              : 'Purchases are not configured in this build. Add your RevenueCat keys and use a development build (see README).'}
          </Text>
          {__DEV__ ? <Button title="Dev: unlock Premium" variant="ghost" onPress={() => run(async () => true, '')} /> : null}
        </Card>
      ) : null}

      <Button
        title={busy ? 'Please wait…' : 'Continue'}
        icon="flame"
        disabled={!selected || busy}
        onPress={() => selected && run(() => buy(selected), 'Purchase failed.')}
      />
      {purchasesAvailable() ? (
        <Button title="Restore purchases" variant="ghost" disabled={busy} onPress={() => run(restore, 'Restore failed.')} />
      ) : null}

      <Text style={[styles.body, { fontSize: 11, textAlign: 'center' }]}>
        Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. Manage or
        cancel any time in your App Store / Google Play account settings.
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24 }}>
        {TERMS_URL ? (
          <Text style={{ color: colors.textDim, textDecorationLine: 'underline' }} onPress={() => Linking.openURL(TERMS_URL)}>
            Terms of Use
          </Text>
        ) : null}
        {PRIVACY_URL ? (
          <Text style={{ color: colors.textDim, textDecorationLine: 'underline' }} onPress={() => Linking.openURL(PRIVACY_URL)}>
            Privacy Policy
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}
