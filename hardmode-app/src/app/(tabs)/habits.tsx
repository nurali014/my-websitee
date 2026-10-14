import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { Button, Card, CheckRow, Label, Screen, styles, Title } from '../../components/ui';
import { FREE_HABIT_LIMIT, useStore } from '../../state/store';
import { colors } from '../../theme';

const SUGGESTIONS = ['Train 45 min', 'Read 20 pages', 'No phone in bed', 'Drink 3L water', 'Journal', 'Meditate 10 min'];

export default function HabitsScreen() {
  const { data, todayLog, toggleHabit, addHabit, removeHabit } = useStore();
  const [text, setText] = useState('');
  const atLimit = !data.premium && data.habits.length >= FREE_HABIT_LIMIT;

  const add = (title: string) => {
    if (atLimit) return router.push('/paywall');
    if (addHabit(title)) setText('');
  };

  const confirmRemove = (id: string, title: string) =>
    Alert.alert('Remove habit?', `“${title}” will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeHabit(id) },
    ]);

  return (
    <Screen>
      <Title kicker="Non-negotiables">Habits</Title>

      <Card>
        <Label>Today</Label>
        {data.habits.length === 0 ? <Text style={styles.body}>Add your first habit below.</Text> : null}
        {data.habits.map((h) => (
          <CheckRow
            key={h.id}
            title={h.title}
            done={!!todayLog.habitsDone?.includes(h.id)}
            onPress={() => toggleHabit(h.id)}
            right={
              <Pressable hitSlop={10} onPress={() => confirmRemove(h.id, h.title)}>
                <Ionicons name="trash-outline" size={18} color={colors.textFaint} />
              </Pressable>
            }
          />
        ))}
      </Card>

      <Card>
        <Label>Add a habit</Label>
        <TextInput
          style={styles.input}
          placeholder="e.g. Train 45 minutes"
          placeholderTextColor={colors.textFaint}
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => add(text)}
          returnKeyType="done"
          maxLength={60}
        />
        <Button title={atLimit ? 'Unlock unlimited habits' : 'Add habit'} icon={atLimit ? 'lock-open' : 'add'} onPress={() => add(text)} />
        {!data.premium ? (
          <Text style={[styles.body, { fontSize: 13 }]}>
            Free plan: {data.habits.length}/{FREE_HABIT_LIMIT} habits. Premium unlocks unlimited.
          </Text>
        ) : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTIONS.filter((s) => !data.habits.some((h) => h.title === s)).map((s) => (
            <Pressable
              key={s}
              onPress={() => add(s)}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: colors.textDim, fontSize: 13 }}>+ {s}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </Screen>
  );
}
