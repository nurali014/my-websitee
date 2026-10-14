import { router } from 'expo-router';
import { Alert, Pressable, Switch, Text, View } from 'react-native';

import { Button, Card, Label, Screen, styles } from '../components/ui';
import { scheduleDailyReminder } from '../lib/notifications';
import { useStore } from '../state/store';
import { colors } from '../theme';

const HOURS = [5, 6, 7, 8, 9, 12, 18, 20];

export default function Settings() {
  const { data, setReminder, resetAll } = useStore();
  const { reminder } = data;

  const update = async (enabled: boolean, hour: number) => {
    const ok = await scheduleDailyReminder(enabled, hour, 0).catch(() => false);
    if (enabled && !ok) {
      Alert.alert('Notifications are off', 'Allow notifications for HARDMODE in your phone settings.');
      return setReminder({ ...reminder, enabled: false });
    }
    setReminder({ enabled, hour, minute: 0 });
  };

  return (
    <Screen>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.h2, { fontSize: 18 }]}>Daily reminder</Text>
            <Text style={styles.body}>A push to get your challenge done.</Text>
          </View>
          <Switch
            value={reminder.enabled}
            onValueChange={(v) => update(v, reminder.hour)}
            trackColor={{ true: colors.accent, false: colors.surfaceAlt }}
          />
        </View>
        {reminder.enabled ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {HOURS.map((h) => {
              const on = reminder.hour === h;
              return (
                <Pressable
                  key={h}
                  onPress={() => update(true, h)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: on ? colors.accent : colors.border,
                    backgroundColor: on ? colors.accentDim : 'transparent',
                  }}>
                  <Text style={{ color: on ? colors.text : colors.textDim }}>{`${String(h).padStart(2, '0')}:00`}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </Card>

      <Card>
        <Label>Membership</Label>
        <Text style={[styles.h2, { fontSize: 18 }]}>{data.premium ? 'Premium — active' : 'Free plan'}</Text>
        {!data.premium ? <Button title="Go Premium" icon="flame" onPress={() => router.push('/paywall')} /> : null}
      </Card>

      <Button
        title="Reset all data"
        variant="ghost"
        icon="trash"
        onPress={() =>
          Alert.alert('Reset everything?', 'Streaks, habits, and your Victory Vault will be deleted. This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reset',
              style: 'destructive',
              onPress: () => {
                scheduleDailyReminder(false, 0, 0).catch(() => {});
                resetAll();
                router.replace('/onboarding');
              },
            },
          ])
        }
      />
    </Screen>
  );
}
