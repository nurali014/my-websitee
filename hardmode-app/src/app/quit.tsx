import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button, Card, Label, Screen, styles } from '../components/ui';
import { PUSH_LINES, randomFrom } from '../data/quotes';
import { formatPretty } from '../lib/date';
import { useStore } from '../state/store';
import { colors } from '../theme';

/** Shown when the user taps "I want to quit": a push-back plus a past victory. */
export default function QuitScreen() {
  const { data } = useStore();
  const [line] = useState(() => randomFrom(PUSH_LINES));
  const [win] = useState(() => (data.vault.length ? randomFrom(data.vault) : null));

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, justifyContent: 'center', gap: 20 }}>
        <Label color={colors.accent}>Not today</Label>
        <Text style={[styles.title, { fontSize: 30, lineHeight: 38 }]}>{line}</Text>
        {win ? (
          <Card>
            <Label color={colors.gold}>From your Victory Vault · {formatPretty(win.date)}</Label>
            <Text style={[styles.body, { color: colors.text, fontSize: 17 }]}>{win.text}</Text>
          </Card>
        ) : (
          <Text style={styles.body}>Your Vault is empty — finish today and you will have your first proof.</Text>
        )}
      </View>
      <Button title="Back to work" icon="flame" onPress={() => router.back()} />
    </Screen>
  );
}
