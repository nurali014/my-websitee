import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button, Card, Label, ProgressBar, Screen, Stat, styles, Title } from '../../components/ui';
import { RANKS, rankFor } from '../../data/ranks';
import { addDays, dateKey } from '../../lib/date';
import { useStore } from '../../state/store';
import { colors } from '../../theme';

const FREE_WEEKS = 2;
const PREMIUM_WEEKS = 12;

export default function ProgressScreen() {
  const { data, xp, streak, disciplineScore } = useStore();
  const rank = rankFor(xp);
  const weeks = data.premium ? PREMIUM_WEEKS : FREE_WEEKS;

  // Columns = weeks (oldest → newest), rows = days. Last cell is today.
  const today = new Date();
  const totalDays = weeks * 7;
  const cells = Array.from({ length: totalDays }, (_, i) => {
    const key = dateKey(addDays(today, i - (totalDays - 1)));
    const log = data.days[key];
    const level = log?.hardDone ? 3 : log?.challengeDone ? 2 : log?.habitsDone?.length ? 1 : 0;
    return { key, level };
  });
  const columns = Array.from({ length: weeks }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const shade = [colors.surfaceAlt, '#5A2A18', colors.accent, colors.gold];
  const wonDays = Object.values(data.days).filter((d) => d.challengeDone).length;

  return (
    <Screen>
      <Title kicker="The scoreboard">Progress</Title>

      <Card>
        <View style={{ flexDirection: 'row' }}>
          <Stat value={streak.current} label="Current" color={colors.accent} />
          <Stat value={streak.longest} label="Longest" />
          <Stat value={wonDays} label="Days won" color={colors.success} />
        </View>
      </Card>

      <Card>
        <Label>Discipline score · last 7 days</Label>
        <Text style={[styles.statValue, { color: colors.text }]}>{disciplineScore}/100</Text>
        <ProgressBar value={disciplineScore / 100} />
      </Card>

      <Card>
        <Label>Last {weeks} weeks</Label>
        <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'center' }}>
          {columns.map((col, i) => (
            <View key={i} style={{ gap: 4 }}>
              {col.map((c) => (
                <View key={c.key} style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: shade[c.level] }} />
              ))}
            </View>
          ))}
        </View>
        <Text style={[styles.body, { fontSize: 12 }]}>Orange = challenge done · Gold = Hard Mode done</Text>
        {!data.premium ? (
          <Button title="See 12 weeks of history" variant="ghost" icon="lock-open" onPress={() => router.push('/paywall')} />
        ) : null}
      </Card>

      <Card>
        <Label>Rank · {xp} XP</Label>
        {RANKS.map((r, i) => {
          const reached = xp >= r.minXp;
          return (
            <View key={r.name} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: reached ? colors.text : colors.textFaint, fontWeight: i + 1 === rank.level ? '900' : '600', fontSize: 16 }}>
                {i + 1 === rank.level ? '▶ ' : ''}
                {r.name}
              </Text>
              <Text style={{ color: reached ? colors.gold : colors.textFaint }}>{r.minXp} XP</Text>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}
