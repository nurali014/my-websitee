import { dateKey, hashString } from '../lib/date';

export type Category = 'Body' | 'Mind' | 'Discipline' | 'Social' | 'Fear';

export type Challenge = {
  id: string;
  title: string;
  detail: string;
  category: Category;
};

/** Standard daily challenges: uncomfortable, but doable by anyone. */
export const CHALLENGES: Challenge[] = [
  { id: 'c1', category: 'Body', title: 'Cold shower finish', detail: 'End your shower with 60 seconds of fully cold water. No flinching, slow breaths.' },
  { id: 'c2', category: 'Discipline', title: 'Up before the sun', detail: 'Wake up 1 hour earlier than usual. No snooze. Feet on the floor immediately.' },
  { id: 'c3', category: 'Mind', title: 'Social media blackout', detail: 'Zero social media for the entire day. Delete the apps until tomorrow if you have to.' },
  { id: 'c4', category: 'Body', title: '100 push-ups', detail: 'Complete 100 push-ups today. Break them into as many sets as you need, but finish.' },
  { id: 'c5', category: 'Social', title: 'Talk to a stranger', detail: 'Start a real conversation with someone you don’t know. Ask them a genuine question.' },
  { id: 'c6', category: 'Mind', title: 'One hour deep work', detail: 'Work on your most important task for 60 minutes. Phone in another room.' },
  { id: 'c7', category: 'Discipline', title: 'No sugar today', detail: 'No added sugar, no sweets, no soda. Read the labels.' },
  { id: 'c8', category: 'Fear', title: 'Do the thing you’re avoiding', detail: 'Pick the task you’ve postponed the longest and finish it today.' },
  { id: 'c9', category: 'Body', title: '10,000 steps', detail: 'Hit 10,000 steps before bed. Take the stairs, walk the calls.' },
  { id: 'c10', category: 'Mind', title: 'Read 30 pages', detail: 'Read 30 pages of a non-fiction book. No skimming.' },
  { id: 'c11', category: 'Social', title: 'Make the hard call', detail: 'Call someone you’ve been avoiding — an apology, a thank you, or a hard conversation.' },
  { id: 'c12', category: 'Discipline', title: 'Make your bed, clean your space', detail: 'Bed made, desk cleared, dishes done before noon.' },
  { id: 'c13', category: 'Mind', title: '20 minutes of silence', detail: 'Sit alone for 20 minutes. No phone, no music, no distractions. Just you and your thoughts.' },
  { id: 'c14', category: 'Body', title: 'Run until it hurts, then one more km', detail: 'Go for a run. When you want to stop, do one more kilometer.' },
  { id: 'c15', category: 'Fear', title: 'Post something real', detail: 'Share an honest opinion, a piece of your work, or a goal publicly.' },
  { id: 'c16', category: 'Discipline', title: 'Eat clean all day', detail: 'Whole foods only. No fast food, no processed snacks.' },
  { id: 'c17', category: 'Mind', title: 'Write your weaknesses', detail: 'Write down 3 honest weaknesses and one action to attack each one.' },
  { id: 'c18', category: 'Social', title: 'Give a genuine compliment', detail: 'Give three people specific, honest compliments today.' },
  { id: 'c19', category: 'Body', title: '5-minute plank total', detail: 'Accumulate 5 minutes of plank today. Any number of sets.' },
  { id: 'c20', category: 'Discipline', title: 'No complaining', detail: 'Zero complaints today — out loud or in text. Catch yourself and reframe.' },
  { id: 'c21', category: 'Fear', title: 'Ask for what you want', detail: 'Ask for something you normally wouldn’t: a raise, a discount, feedback, a date.' },
  { id: 'c22', category: 'Mind', title: 'Learn something hard', detail: 'Spend 45 minutes learning a skill that makes you feel slow and clumsy.' },
  { id: 'c23', category: 'Body', title: '200 squats', detail: 'Complete 200 bodyweight squats today. Finish them before dinner.' },
  { id: 'c24', category: 'Discipline', title: 'Phone-free morning', detail: 'No phone for the first 2 hours after waking up.' },
  { id: 'c25', category: 'Social', title: 'Say no', detail: 'Say no to one thing that doesn’t serve your goals. No excuses, no over-explaining.' },
  { id: 'c26', category: 'Fear', title: 'Eat lunch alone in public', detail: 'Eat at a restaurant or café alone, without looking at your phone.' },
  { id: 'c27', category: 'Mind', title: 'Plan tomorrow tonight', detail: 'Before bed, write tomorrow’s top 3 priorities and the exact time you’ll do each.' },
  { id: 'c28', category: 'Body', title: 'Walk 30 minutes in the cold or heat', detail: 'Go outside regardless of the weather. 30 minutes, no complaining.' },
  { id: 'c29', category: 'Discipline', title: 'In bed by 10 PM', detail: 'Lights out by 10 PM. Screens off 30 minutes before.' },
  { id: 'c30', category: 'Fear', title: 'Record yourself speaking', detail: 'Record a 2-minute video about your goals. Watch it back. Don’t delete it.' },
];

/** Hard Mode (Premium): a second, brutal challenge every day. */
export const HARD_CHALLENGES: Challenge[] = [
  { id: 'h1', category: 'Body', title: '3-minute ice cold shower', detail: 'Three full minutes of cold water. Control your breathing the entire time.' },
  { id: 'h2', category: 'Discipline', title: '24-hour dopamine fast', detail: 'No social media, no games, no streaming, no junk food for 24 hours.' },
  { id: 'h3', category: 'Body', title: '300 burpees', detail: '300 burpees today. Track every set. Don’t stop until it’s done.' },
  { id: 'h4', category: 'Body', title: 'Run a half marathon distance', detail: '21 km today — walk if you must, but cover the distance.' },
  { id: 'h5', category: 'Discipline', title: '4:30 AM wake-up', detail: 'Alarm at 4:30. Train before the world wakes up.' },
  { id: 'h6', category: 'Fear', title: 'Pitch yourself', detail: 'Reach out to 5 people who could change your career. Send the messages.' },
  { id: 'h7', category: 'Mind', title: '4 hours of deep work', detail: 'Four focused hours on one goal. Blocks of 50 minutes, 10 minutes rest.' },
  { id: 'h8', category: 'Body', title: '1,000 reps', detail: '250 push-ups, 250 squats, 250 sit-ups, 250 lunges. Today.' },
  { id: 'h9', category: 'Discipline', title: '18-hour fast', detail: 'No food for 18 hours. Water, black coffee, or tea only.' },
  { id: 'h10', category: 'Fear', title: 'Face your biggest fear', detail: 'Take one concrete step toward the thing that scares you most.' },
  { id: 'h11', category: 'Body', title: 'Weighted backpack walk', detail: 'Walk 8 km with a heavy backpack. Embrace the suck.' },
  { id: 'h12', category: 'Mind', title: 'Total silence day', detail: 'No music, podcasts, or videos all day. Only your thoughts.' },
];

function pick<T>(list: T[], seed: string): T {
  return list[hashString(seed) % list.length];
}

export function challengeFor(day: string = dateKey()): Challenge {
  return pick(CHALLENGES, `std:${day}`);
}

export function hardChallengeFor(day: string = dateKey()): Challenge {
  return pick(HARD_CHALLENGES, `hard:${day}`);
}
