export type Rank = { name: string; minXp: number };

export const RANKS: Rank[] = [
  { name: 'Recruit', minXp: 0 },
  { name: 'Grinder', minXp: 500 },
  { name: 'Warrior', minXp: 1500 },
  { name: 'Savage', minXp: 3500 },
  { name: 'Unbreakable', minXp: 7000 },
  { name: 'Legend', minXp: 12000 },
];

export const XP = {
  challenge: 50,
  hardChallenge: 100,
  habit: 10,
  vaultEntry: 15,
};

export function rankFor(xp: number) {
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) if (xp >= RANKS[i].minXp) index = i;
  const current = RANKS[index];
  const next = RANKS[index + 1];
  const progress = next ? (xp - current.minXp) / (next.minXp - current.minXp) : 1;
  return { current, next, level: index + 1, progress };
}
