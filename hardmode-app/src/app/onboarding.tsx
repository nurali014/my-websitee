import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button, Screen, styles } from '../components/ui';
import { FREE_HABIT_LIMIT, useStore } from '../state/store';
import { colors } from '../theme';

const STARTER_HABITS = ['Train 45 min', 'Read 20 pages', 'Cold shower', 'No phone first hour', 'Journal', 'Sleep by 10 PM'];

const SLIDES = [
  { title: 'Comfort is the enemy.', body: 'Every day you get one challenge that pushes you out of your comfort zone. No rerolls. No excuses.' },
  { title: 'Win the day.', body: 'Complete the challenge, keep your streak alive, and build a discipline score that tells you the truth.' },
  { title: 'Build an unbreakable mind.', body: 'Log every victory in your Vault. When you want to quit, it will remind you who you really are.' },
];

export default function Onboarding() {
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  const finish = () => {
    completeOnboarding(name, picked);
    router.replace('/');
  };

  if (step < SLIDES.length) {
    const s = SLIDES[step];
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
          <Text style={{ color: colors.accent, fontWeight: '900', letterSpacing: 4 }}>HARDMODE</Text>
          <Text style={[styles.title, { fontSize: 40 }]}>{s.title}</Text>
          <Text style={[styles.body, { fontSize: 17, lineHeight: 26 }]}>{s.body}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
          {SLIDES.map((_, i) => (
            <View key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === step ? colors.accent : colors.border }} />
          ))}
        </View>
        <Button title={step === SLIDES.length - 1 ? 'I’m ready' : 'Next'} onPress={() => setStep(step + 1)} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>What do we call you?</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor={colors.textFaint}
        value={name}
        onChangeText={setName}
        maxLength={24}
      />
      <Text style={[styles.title, { fontSize: 24, marginTop: 12 }]}>Pick up to {FREE_HABIT_LIMIT} daily habits</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {STARTER_HABITS.map((h) => {
          const on = picked.includes(h);
          return (
            <Pressable
              key={h}
              onPress={() =>
                setPicked(on ? picked.filter((x) => x !== h) : picked.length < FREE_HABIT_LIMIT ? [...picked, h] : picked)
              }
              style={{
                borderWidth: 1,
                borderColor: on ? colors.accent : colors.border,
                backgroundColor: on ? colors.accentDim : 'transparent',
                borderRadius: 999,
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}>
              <Text style={{ color: on ? colors.text : colors.textDim, fontWeight: '600' }}>{h}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ height: 12 }} />
      <Button title="Start" icon="flame" onPress={finish} />
    </Screen>
  );
}
