import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button, Card, CheckRow, Label, ProgressBar, Screen, Stat, styles, Title } from '../../components/ui';
import { challengeFor, hardChallengeFor } from '../../data/challenges';
import { quoteOfTheDay } from '../../data/quotes';
import { rankFor } from '../../data/ranks';
import { formatPretty } from '../../lib/date';
import { useStore } from '../../state/store';
import { colors } from '../../theme';

export default function TodayScreen() {
  const { data, today, todayLog, xp, streak, disciplineScore, toggleChallenge, toggleHardChallenge, toggleHabit } =
    useStore();
  const challenge = challengeFor(today);
  const hard = hardChallengeFor(today);
  const rank = rankFor(xp);
  const habitsDone = data.habits.filter((h) => todayLog.habitsDone?.includes(h.id)).length;

  return (
    <Screen>
      <Title
        kicker={formatPretty(today)}
        right={
          <Link href="/settings" asChild>
            <Pressable hitSlop={12}>
              <Ionicons name="settings-outline" size={24} color={colors.textDim} />
            </Pressable>
          </Link>
        }>
        {data.name ? `Get after it, ${data.name}.` : 'Get after it.'}
      </Title>

      <Card>
        <View style={{ flexDirection: 'row' }}>
          <Stat value={`${streak.current}🔥`} label="Streak" color={colors.accent} />
          <Stat value={disciplineScore} label="Discipline" />
          <Stat value={`Lv ${rank.level}`} label={rank.current.name} color={colors.gold} />
        </View>
        <ProgressBar value={rank.progress} color={colors.gold} />
        <Text style={[styles.body, { fontSize: 12, textAlign: 'center' }]}>
          {rank.next ? `${xp} / ${rank.next.minXp} XP to ${rank.next.name}` : `${xp} XP — max rank`}
        </Text>
      </Card>

      <Card accent={!todayLog.challengeDone}>
        <Label color={colors.accent}>Today’s challenge · {challenge.category}</Label>
        <Text style={styles.h2}>{challenge.title}</Text>
        <Text style={styles.body}>{challenge.detail}</Text>
        <Button
          title={todayLog.challengeDone ? 'Completed — day won' : 'I did it'}
          icon={todayLog.challengeDone ? 'checkmark-circle' : 'flame'}
          variant={todayLog.challengeDone ? 'success' : 'primary'}
          onPress={toggleChallenge}
        />
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Label color={colors.gold}>Hard Mode · {hard.category}</Label>
          {!data.premium ? <Ionicons name="lock-closed" size={16} color={colors.gold} /> : null}
        </View>
        {data.premium ? (
          <>
            <Text style={styles.h2}>{hard.title}</Text>
            <Text style={styles.body}>{hard.detail}</Text>
            <CheckRow title="Hard Mode completed (+100 XP)" done={!!todayLog.hardDone} onPress={toggleHardChallenge} />
          </>
        ) : (
          <>
            <Text style={styles.body}>A second, brutal challenge every day for those who want more.</Text>
            <Button title="Unlock Hard Mode" variant="ghost" icon="lock-open" onPress={() => router.push('/paywall')} />
          </>
        )}
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Label>Daily habits</Label>
          <Label>
            {habitsDone}/{data.habits.length}
          </Label>
        </View>
        {data.habits.length === 0 ? (
          <Text style={styles.body}>No habits yet. Add the non-negotiables in the Habits tab.</Text>
        ) : (
          data.habits.map((h) => (
            <CheckRow
              key={h.id}
              title={h.title}
              done={!!todayLog.habitsDone?.includes(h.id)}
              onPress={() => toggleHabit(h.id)}
            />
          ))
        )}
      </Card>

      <Card>
        <Label>Words for today</Label>
        <Text style={[styles.h2, { fontSize: 19, lineHeight: 26 }]}>“{quoteOfTheDay(today)}”</Text>
      </Card>

      <Button title="I want to quit" variant="ghost" icon="hand-left" onPress={() => router.push('/quit')} />
    </Screen>
  );
}
