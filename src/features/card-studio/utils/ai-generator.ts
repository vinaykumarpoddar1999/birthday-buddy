import type { AIGeneratedContent, AIRelationship, AITone } from '../types';

const HEADLINES: Record<AITone, string[]> = {
  funny: [
    "You're Not Old, You're Vintage!",
    "Another Year of Being Awesome!",
    "Warning: Birthday Mode Activated!",
    "Age is Just a Number (A Big One!)",
    "Let's Taco 'Bout Your Birthday!",
  ],
  emotional: [
    'A Beautiful Soul Deserves a Beautiful Day',
    'Celebrating the Gift That Is You',
    'Every Year With You Is a Blessing',
    'To Someone Who Makes the World Brighter',
    'A Heart Full of Love on Your Special Day',
  ],
  romantic: [
    'To the Love of My Life',
    'Every Moment With You Is Magic',
    'My Heart Beats for You',
    'Forever and Always, My Love',
    'You Are My Greatest Adventure',
  ],
  formal: [
    'Warmest Birthday Wishes',
    'Wishing You a Wonderful Birthday',
    'With Best Wishes on Your Birthday',
    'A Special Day for a Special Person',
    'Celebrating Your Special Day',
  ],
  luxury: [
    'A Toast to an Extraordinary Person',
    'Elegance Personified, Happy Birthday',
    'May This Year Shine Like Gold',
    'To a Life of Grandeur and Joy',
    'A Celebration Worthy of Royalty',
  ],
  heartfelt: [
    'From My Heart to Yours',
    'You Mean the World to Me',
    'A Day to Celebrate Your Beautiful Soul',
    'With All My Love and Warmth',
    'Grateful for Every Moment With You',
  ],
};

const WISHES: Record<AITone, Record<AIRelationship, string[]>> = {
  funny: {
    friend: [
      "Happy Birthday, {{recipientName}}! They say with age comes wisdom. So you must be the wisest person I know by now! Here's to another year of questionable decisions and amazing memories!",
      "{{recipientName}}, you're not getting older — you're leveling up! May your birthday be filled with cake, laughter, and zero responsibilities!",
      "Another year older, another year of me pretending I remembered your birthday without Facebook's help. Just kidding, {{recipientName}}! You're unforgettable!",
    ],
    family: [
      "Happy Birthday, {{recipientName}}! Growing up with you was an adventure. Growing old with you? Even better! Love you more than you'll ever know (even when you're annoying)!",
      "{{recipientName}}, the family wouldn't be the same without your weird sense of humor and warm heart. Here's to another year of being the favorite!",
    ],
    partner: [
      "Happy Birthday to the person who steals the covers, eats my fries, and has completely stolen my heart. Love you, {{recipientName}}!",
      "{{recipientName}}, another year of putting up with me deserves a medal. But for now, happy birthday! I promise to be 1% less annoying this year.",
    ],
    colleague: [
      "Happy Birthday, {{recipientName}}! Thanks for making work actually bearable. May your inbox be empty and your coffee strong!",
      "{{recipientName}}, cheers to another year of pretending we're working while actually chatting! Happy Birthday!",
    ],
  },
  emotional: {
    friend: [
      "Happy Birthday, {{recipientName}}. Your friendship has been one of the greatest gifts life has given me. May this year bring you all the happiness you truly deserve.",
      "{{recipientName}}, watching you grow into the incredible person you are has been a privilege. Wishing you a birthday as special as you are to me.",
    ],
    family: [
      "Happy Birthday, dear {{recipientName}}. You are the heart and soul of our family. Every day with you is a gift, and today we celebrate the beautiful person you are.",
      "{{recipientName}}, from our first memories together to this moment, you've filled my life with so much love. Happy Birthday to someone truly irreplaceable.",
    ],
    partner: [
      "Happy Birthday, {{recipientName}}. You walked into my life and changed everything for the better. Every day I love you more than the last.",
      "{{recipientName}}, you are my home, my peace, and my greatest love. Wishing you a birthday filled with as much joy as you bring to my life.",
    ],
    colleague: [
      "Happy Birthday, {{recipientName}}. Working alongside you has been an inspiring journey. Wishing you success and happiness in the year ahead.",
    ],
  },
  romantic: {
    friend: [
      "Happy Birthday, {{recipientName}}! You light up every room you walk into. The world is a more beautiful place because of you.",
    ],
    family: [
      "Happy Birthday, {{recipientName}}. Our bond is something truly special, and I cherish every moment we share together.",
    ],
    partner: [
      "My dearest {{recipientName}}, happy birthday. You are the reason I believe in love. Every sunrise with you is a gift I'll never take for granted.",
      "{{recipientName}}, you are the poem I never knew how to write, the song I always wanted to hear. Happy Birthday, my love. Today and forever.",
      "To my {{recipientName}} — your love is the most beautiful thing in my world. On your birthday, I want you to know that you are loved beyond measure.",
    ],
    colleague: [
      "Happy Birthday, {{recipientName}}! Your positive energy makes every day at work a pleasure. Wishing you a wonderful celebration!",
    ],
  },
  formal: {
    friend: [
      "Dear {{recipientName}}, wishing you a very happy birthday. May this new year of your life bring you prosperity, good health, and fulfillment.",
    ],
    family: [
      "Dear {{recipientName}}, on the occasion of your birthday, I wish you good health, happiness, and continued success. You make our family proud.",
    ],
    partner: [
      "Dear {{recipientName}}, wishing you a most wonderful birthday. May this year bring you everything your heart desires.",
    ],
    colleague: [
      "Dear {{recipientName}}, wishing you a very happy birthday. Your dedication and professionalism are truly admirable. Here's to a year of continued success.",
      "Happy Birthday, {{recipientName}}. Your contributions to our team are invaluable, and I hope this year brings you well-deserved recognition and achievement.",
    ],
  },
  luxury: {
    friend: [
      "Happy Birthday, {{recipientName}}! May your year ahead be as brilliant and magnificent as you are. Here's to a life of elegance, joy, and extraordinary moments.",
    ],
    family: [
      "Happy Birthday, {{recipientName}}. May this year bring you the finest things in life — love, laughter, and moments that sparkle like gold.",
    ],
    partner: [
      "To my exquisite {{recipientName}}, happy birthday. You deserve a life of grandeur, and I promise to make every moment with you extraordinary.",
    ],
    colleague: [
      "Happy Birthday, {{recipientName}}. Wishing you a year of remarkable achievements and distinguished success.",
    ],
  },
  heartfelt: {
    friend: [
      "Happy Birthday, {{recipientName}}. I want you to know how grateful I am for your friendship. You've been my rock, my confidant, and my greatest supporter.",
      "{{recipientName}}, thank you for being you — kind, generous, and endlessly caring. The world needs more people like you. Happy Birthday!",
    ],
    family: [
      "Happy Birthday, {{recipientName}}. If I could give you one thing, it would be the ability to see yourself through my eyes. Then you'd know how truly special you are.",
      "{{recipientName}}, you've taught me so much about love, patience, and strength. On your birthday, I want you to know how deeply I appreciate everything you do.",
    ],
    partner: [
      "Happy Birthday, {{recipientName}}. Thank you for loving me through every season of life. You are my greatest blessing, and I am forever grateful.",
      "{{recipientName}}, your love has transformed my life in ways words cannot express. On your birthday, just know — you are everything to me.",
    ],
    colleague: [
      "Happy Birthday, {{recipientName}}. Your kindness and sincerity have touched everyone around you. Wishing you a year as wonderful as your heart.",
    ],
  },
};

const CLOSINGS: Record<AITone, string[]> = {
  funny: [
    'Now go eat cake like nobody\'s watching!',
    'Party hard, sleep harder!',
    "Don't count the candles, enjoy the glow!",
    'May your birthday be as lit as your candles!',
  ],
  emotional: [
    'With all my love, today and always.',
    'You are cherished more than words can say.',
    'May every wish you make come true.',
    'Here\'s to a year of beautiful moments.',
  ],
  romantic: [
    'Forever yours, with all my heart.',
    'Loving you today, tomorrow, and always.',
    'You are my forever and always.',
    'With every beat of my heart.',
  ],
  formal: [
    'With warm regards and best wishes.',
    'Wishing you all the best.',
    'May this year bring you much success.',
    'With sincere wishes for a wonderful year.',
  ],
  luxury: [
    'To a year of brilliance and splendor.',
    'May every moment be extraordinary.',
    'Here\'s to living life in golden hues.',
    'Cheers to a magnificent year ahead.',
  ],
  heartfelt: [
    'With all the love in my heart.',
    'Thank you for being you.',
    'You make this world a better place.',
    'Grateful for every moment with you.',
  ],
};

const SIGNATURES: Record<AITone, string[]> = {
  funny: ['Your favorite person ever', 'The cooler friend', 'Chief Birthday Wisher'],
  emotional: ['With endless love', 'Always and forever', 'From the bottom of my heart'],
  romantic: ['Your one and only', 'Forever yours', 'All my love'],
  formal: ['With warm regards', 'Best wishes', 'Sincerely'],
  luxury: ['With admiration', 'Most elegantly', 'Gracefully yours'],
  heartfelt: ['With all my heart', 'Sending love', 'Yours truly'],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCardContent(
  tone: AITone,
  relationship: AIRelationship,
  recipientName: string,
): AIGeneratedContent {
  const headline = pickRandom(HEADLINES[tone]);
  const wishPool = WISHES[tone][relationship] || WISHES[tone].friend;
  const wish = pickRandom(wishPool).replace(/\{\{recipientName\}\}/g, recipientName || 'Friend');
  const closing = pickRandom(CLOSINGS[tone]);
  const signature = pickRandom(SIGNATURES[tone]);

  return { headline, wish, closing, signature };
}
