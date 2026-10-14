import { dateKey, hashString } from '../lib/date';

export const QUOTES: string[] = [
  'Nobody is coming to save you. Get up.',
  'Comfort is the slow death of your potential.',
  'You don’t need motivation. You need a decision.',
  'The version of you that you want to become is on the other side of this.',
  'When your mind says stop, you are only scratching the surface of what you have.',
  'Discipline is doing it when you don’t feel like it.',
  'Your excuses are lying to you.',
  'Pain is temporary. Regret is permanent.',
  'Be the hardest worker in the room — even when the room is empty.',
  'You will never always be motivated. Learn to be disciplined.',
  'Hard choices, easy life. Easy choices, hard life.',
  'Callus your mind the way you callus your hands.',
  'The work doesn’t care how you feel.',
  'Every rep you skip, someone else is doing.',
  'Small daily wins build an unbreakable mind.',
  'Feelings are suggestions. Actions are decisions.',
  'Don’t negotiate with the weak voice in your head.',
  'You are not tired. You are uncomfortable. There is a difference.',
  'Become the person who does it anyway.',
  'Average is a choice. Choose differently today.',
];

/** Lines shown when the user hits "I want to quit". */
export const PUSH_LINES: string[] = [
  'You’re not done. Your mind is just negotiating. Most people quit with plenty left in the tank — you are not most people.',
  'Breathe. Five more minutes. Then decide again.',
  'Remember why you started. That reason hasn’t changed — only your comfort level has.',
  'This feeling is the exact moment growth happens. Stay in it.',
  'Quitting feels good for ten minutes. Finishing feels good for the rest of your life.',
  'You’ve done hard things before. Look at your Victory Vault. That person is still you.',
  'Shrink the goal: just the next step. Then the next one.',
];

export function quoteOfTheDay(day: string = dateKey()): string {
  return QUOTES[hashString(`q:${day}`) % QUOTES.length];
}

export function randomFrom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}
