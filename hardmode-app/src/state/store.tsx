import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { XP } from '../data/ranks';
import { addDays, dateKey } from '../lib/date';

export const FREE_HABIT_LIMIT = 3;
const STORAGE_KEY = 'hardmode:v1';

export type Habit = { id: string; title: string; createdAt: string };
export type DayLog = { challengeDone?: boolean; hardDone?: boolean; habitsDone?: string[] };
export type VaultEntry = { id: string; text: string; date: string };
export type Reminder = { enabled: boolean; hour: number; minute: number };

export type AppData = {
  onboarded: boolean;
  startedAt?: string;
  name: string;
  habits: Habit[];
  days: Record<string, DayLog>;
  vault: VaultEntry[];
  reminder: Reminder;
  premium: boolean;
};

const DEFAULT_DATA: AppData = {
  onboarded: false,
  name: '',
  habits: [],
  days: {},
  vault: [],
  reminder: { enabled: false, hour: 6, minute: 0 },
  premium: false,
};

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** A day is "won" when the daily challenge was completed. */
const isWon = (log?: DayLog) => !!log?.challengeDone;

export function computeStreaks(days: Record<string, DayLog>, today = new Date()) {
  let current = 0;
  let cursor = isWon(days[dateKey(today)]) ? today : addDays(today, -1);
  while (isWon(days[dateKey(cursor)])) {
    current++;
    cursor = addDays(cursor, -1);
  }

  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of Object.keys(days).filter((k) => isWon(days[k])).sort()) {
    const [y, m, d] = key.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    run = prev && dateKey(addDays(prev, 1)) === key ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = date;
  }
  return { current, longest: Math.max(longest, current) };
}

export function computeXp(data: AppData) {
  let xp = data.vault.length * XP.vaultEntry;
  for (const log of Object.values(data.days)) {
    if (log.challengeDone) xp += XP.challenge;
    if (log.hardDone) xp += XP.hardChallenge;
    xp += (log.habitsDone?.length ?? 0) * XP.habit;
  }
  return xp;
}

/** 0–100: share of challenges + habits completed over the last 7 days (since the user started). */
export function computeDisciplineScore(data: AppData, today = new Date()) {
  let done = 0;
  let possible = 0;
  for (let i = 0; i < 7; i++) {
    const key = dateKey(addDays(today, -i));
    if (data.startedAt && key < data.startedAt) break;
    const log = data.days[key];
    possible += 1 + data.habits.length;
    if (log?.challengeDone) done++;
    done += log?.habitsDone?.filter((id) => data.habits.some((h) => h.id === id)).length ?? 0;
  }
  return possible === 0 ? 0 : Math.round((done / possible) * 100);
}

type Store = {
  ready: boolean;
  data: AppData;
  today: string;
  todayLog: DayLog;
  xp: number;
  streak: { current: number; longest: number };
  disciplineScore: number;
  completeOnboarding: (name: string, habits: string[]) => void;
  toggleChallenge: () => void;
  toggleHardChallenge: () => void;
  toggleHabit: (id: string) => void;
  addHabit: (title: string) => boolean;
  removeHabit: (id: string) => void;
  addVaultEntry: (text: string) => void;
  removeVaultEntry: (id: string) => void;
  setReminder: (r: Reminder) => void;
  setPremium: (p: boolean) => void;
  resetAll: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState(dateKey());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setData({ ...DEFAULT_DATA, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  // Roll over to the new day if the app stays open past midnight.
  useEffect(() => {
    const t = setInterval(() => setToday(dateKey()), 60_000);
    return () => clearInterval(t);
  }, []);

  const updateToday = useCallback(
    (fn: (log: DayLog) => DayLog) =>
      setData((d) => ({ ...d, days: { ...d.days, [today]: fn(d.days[today] ?? {}) } })),
    [today],
  );

  const setPremium = useCallback(
    (premium: boolean) => setData((d) => (d.premium === premium ? d : { ...d, premium })),
    [],
  );

  const store = useMemo<Store>(() => {
    const todayLog = data.days[today] ?? {};
    return {
      ready,
      data,
      today,
      todayLog,
      xp: computeXp(data),
      streak: computeStreaks(data.days),
      disciplineScore: computeDisciplineScore(data),
      completeOnboarding: (name, habits) =>
        setData((d) => ({
          ...d,
          onboarded: true,
          startedAt: today,
          name: name.trim(),
          habits: habits.map((title) => ({ id: newId(), title, createdAt: today })),
        })),
      toggleChallenge: () => updateToday((l) => ({ ...l, challengeDone: !l.challengeDone })),
      toggleHardChallenge: () => updateToday((l) => ({ ...l, hardDone: !l.hardDone })),
      toggleHabit: (id) =>
        updateToday((l) => {
          const done = l.habitsDone ?? [];
          return { ...l, habitsDone: done.includes(id) ? done.filter((x) => x !== id) : [...done, id] };
        }),
      addHabit: (title) => {
        if (!title.trim()) return false;
        if (!data.premium && data.habits.length >= FREE_HABIT_LIMIT) return false;
        setData((d) => ({ ...d, habits: [...d.habits, { id: newId(), title: title.trim(), createdAt: today }] }));
        return true;
      },
      removeHabit: (id) => setData((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) })),
      addVaultEntry: (text) =>
        setData((d) => ({ ...d, vault: [{ id: newId(), text: text.trim(), date: today }, ...d.vault] })),
      removeVaultEntry: (id) => setData((d) => ({ ...d, vault: d.vault.filter((v) => v.id !== id) })),
      setReminder: (reminder) => setData((d) => ({ ...d, reminder })),
      setPremium,
      // Premium is tied to the store account, not local data, so it survives a reset.
      resetAll: () => setData((d) => ({ ...DEFAULT_DATA, premium: d.premium })),
    };
  }, [data, ready, today, updateToday, setPremium]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
