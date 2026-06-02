import type { Occasion, PersonalQuestion } from '../types';

const BIRTHDAY_QUESTIONS: Omit<PersonalQuestion, 'id' | 'answer'>[] = [
  { label: 'Best Memory Together', placeholder: 'That time we...' },
  { label: 'Funniest Moment', placeholder: 'Remember when you...' },
  { label: 'Life Wish For Them', placeholder: 'I hope this year brings you...' },
  { label: 'Favorite Photo Memory', placeholder: 'Describe a photo moment...' },
  { label: 'Special Message', placeholder: 'What I want you to know...' },
];

const ROMANTIC_QUESTIONS: Omit<PersonalQuestion, 'id' | 'answer'>[] = [
  { label: 'How We Met', placeholder: 'It all started when...' },
  { label: 'First Date', placeholder: 'Our first date was...' },
  { label: 'Favorite Memory', placeholder: 'My favorite moment with you...' },
  { label: 'Future Dream', placeholder: 'I dream of us...' },
  { label: 'Love Letter', placeholder: 'Dear love, I want you to know...' },
];

const FRIENDSHIP_QUESTIONS: Omit<PersonalQuestion, 'id' | 'answer'>[] = [
  { label: 'How We Became Friends', placeholder: 'We met because...' },
  { label: 'Best Adventure', placeholder: 'That time we...' },
  { label: 'Inside Joke', placeholder: 'Only we understand...' },
  { label: 'Why You Matter', placeholder: 'You mean the world because...' },
  { label: 'Cheers Message', placeholder: 'Here is to you...' },
];

const FAMILY_QUESTIONS: Omit<PersonalQuestion, 'id' | 'answer'>[] = [
  { label: 'Favorite Family Memory', placeholder: 'I will never forget...' },
  { label: 'Life Lesson', placeholder: 'You taught me...' },
  { label: 'Gratitude', placeholder: 'I am grateful for...' },
  { label: 'Blessing', placeholder: 'My wish for you...' },
  { label: 'Legacy Message', placeholder: 'What you mean to our family...' },
];

const DEFAULT_QUESTIONS: Omit<PersonalQuestion, 'id' | 'answer'>[] = [
  { label: 'Why This Matters', placeholder: 'This moment is special because...' },
  { label: 'Favorite Memory', placeholder: 'I remember when...' },
  { label: 'Personal Message', placeholder: 'I want you to know...' },
  { label: 'Special Wish', placeholder: 'My wish for you...' },
  { label: 'Closing Note', placeholder: 'With love...' },
];

const QUESTION_MAP: Record<string, Omit<PersonalQuestion, 'id' | 'answer'>[]> = {
  birthday: BIRTHDAY_QUESTIONS,
  anniversary: ROMANTIC_QUESTIONS,
  valentines: ROMANTIC_QUESTIONS,
  proposal: ROMANTIC_QUESTIONS,
  love_confession: ROMANTIC_QUESTIONS,
  miss_you: ROMANTIC_QUESTIONS,
  sorry: DEFAULT_QUESTIONS,
  graduation: DEFAULT_QUESTIONS,
  congratulations: DEFAULT_QUESTIONS,
  baby_shower: FAMILY_QUESTIONS,
  wedding: ROMANTIC_QUESTIONS,
  christmas: FAMILY_QUESTIONS,
  new_year: DEFAULT_QUESTIONS,
  custom: DEFAULT_QUESTIONS,
};

export function generateQuestionsForOccasion(occasion: Occasion): PersonalQuestion[] {
  const templates = QUESTION_MAP[occasion] ?? DEFAULT_QUESTIONS;
  return templates.map((q, i) => ({
    ...q,
    id: `q-${occasion}-${i}`,
    answer: '',
  }));
}

export function generateFriendshipQuestions(): PersonalQuestion[] {
  return FRIENDSHIP_QUESTIONS.map((q, i) => ({
    ...q,
    id: `q-friend-${i}`,
    answer: '',
  }));
}
