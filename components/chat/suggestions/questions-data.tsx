import { WidgetType } from '@/lib/chat-context';
import { ReactNode } from 'react';
import {
  IconUser,
  IconBriefcase,
  IconCode,
  IconBrain,
  IconHeart,
  IconMail,
} from '@tabler/icons-react';

export interface Question {
  id: string;
  text: string;
  featured?: boolean;
  easterEgg?: boolean;
  widgetType?: WidgetType;
  action?: 'random' | 'tour' | 'everything' | 'secret';
}

export interface QuestionSection {
  id: string;
  title: string;
  icon: ReactNode;
  emoji: string;
  questions: Question[];
}

export interface Pill {
  id: string;
  text: string;
  emoji: string;
  widgetType?: WidgetType;
  action?: 'random' | 'tour' | 'everything' | 'secret';
}

// All questions organized by section
export const questionSections: QuestionSection[] = [
  {
    id: 'me',
    title: 'Me',
    icon: <IconUser className="w-5 h-5" />,
    emoji: '🙋',
    questions: [
      {
        id: 'me-1',
        text: 'Who are you? (The real story) ✨',
        featured: true,
        widgetType: 'me',
      },
      {
        id: 'me-2',
        text: 'What makes you tick? 💭',
        featured: true,
        widgetType: 'me',
      },
      {
        id: 'me-3',
        text: 'What are your passions?',
        widgetType: 'me',
      },
      {
        id: 'me-4',
        text: 'How did you get started in tech?',
        widgetType: 'me',
      },
      {
        id: 'me-5',
        text: 'Where do you see yourself in 5 years?',
        widgetType: 'me',
      },
      {
        id: 'me-6',
        text: "What's your origin story?",
        widgetType: 'me',
      },
      {
        id: 'me-easter',
        text: "What's something nobody asks but should? 🔐",
        easterEgg: true,
        widgetType: 'me',
      },
    ],
  },
  {
    id: 'professional',
    title: 'Professional',
    icon: <IconBriefcase className="w-5 h-5" />,
    emoji: '💼',
    questions: [
      {
        id: 'pro-1',
        text: 'Can I see your resume? 📄',
        featured: true,
        widgetType: 'experience',
      },
      {
        id: 'pro-2',
        text: 'Why should I hire you? ⚡',
        featured: true,
        widgetType: 'experience',
      },
      {
        id: 'pro-3',
        text: 'What makes you a valuable team member?',
        widgetType: 'experience',
      },
      {
        id: 'pro-4',
        text: 'Where are you working now?',
        widgetType: 'experience',
      },
      {
        id: 'pro-5',
        text: "What's your educational background?",
        widgetType: 'experience',
      },
      {
        id: 'pro-6',
        text: 'Tell me about your work philosophy',
        widgetType: 'experience',
      },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: <IconCode className="w-5 h-5" />,
    emoji: '💻',
    questions: [
      {
        id: 'proj-1',
        text: 'What projects are you most proud of? 🚀',
        featured: true,
        widgetType: 'projects',
      },
      {
        id: 'proj-2',
        text: 'Show me something impressive 🎯',
        featured: true,
        widgetType: 'projects',
      },
      {
        id: 'proj-3',
        text: 'Tell me about your AI/ML projects',
        widgetType: 'projects',
      },
      {
        id: 'proj-4',
        text: "What's your biggest technical challenge?",
        widgetType: 'projects',
      },
      {
        id: 'proj-5',
        text: 'Which project taught you the most?',
        widgetType: 'projects',
      },
      {
        id: 'proj-6',
        text: 'What are you building right now?',
        widgetType: 'projects',
      },
      { id: 'proj-buildstory', text: 'What is BuildStory?', featured: true, widgetType: 'projects' },
      { id: 'proj-mune', text: 'Tell me about Mune and its on-device AI', featured: true, widgetType: 'projects' },
      { id: 'proj-wrap', text: 'What is WRAP and your CHI research?', widgetType: 'projects' },
      {
        id: 'proj-easter',
        text: 'What project idea keeps you up at night? 🔐',
        easterEgg: true,
        widgetType: 'projects',
      },
    ],
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: <IconBrain className="w-5 h-5" />,
    emoji: '🧠',
    questions: [
      {
        id: 'skill-1',
        text: 'What are your skills? 💪',
        featured: true,
        widgetType: 'skills',
      },
      {
        id: 'skill-2',
        text: "What's your tech stack? 🛠️",
        featured: true,
        widgetType: 'skills',
      },
      {
        id: 'skill-3',
        text: 'What technologies do you work with?',
        widgetType: 'skills',
      },
      {
        id: 'skill-4',
        text: "What's your favorite programming language?",
        widgetType: 'skills',
      },
      {
        id: 'skill-5',
        text: 'What are you learning right now?',
        widgetType: 'skills',
      },
      {
        id: 'skill-6',
        text: 'Frontend or backend?',
        widgetType: 'skills',
      },
      {
        id: 'skill-easter',
        text: 'What skill do you secretly want to learn? 🔐',
        easterEgg: true,
        widgetType: 'skills',
      },
    ],
  },
  {
    id: 'fun',
    title: 'Fun',
    icon: <IconHeart className="w-5 h-5" />,
    emoji: '🎨',
    questions: [
      {
        id: 'fun-2',
        text: "What's the craziest thing you've ever done? 🤯",
        featured: true,
        widgetType: 'fun',
      },
      {
        id: 'fun-3',
        text: 'Tell me something fun about you',
        widgetType: 'fun',
      },
      {
        id: 'fun-4',
        text: 'What are your hobbies?',
        widgetType: 'fun',
      },
      {
        id: 'fun-5',
        text: 'Got any adventure stories?',
        widgetType: 'fun',
      },
      {
        id: 'fun-6',
        text: 'Mac or PC?',
        widgetType: 'fun',
      },
      {
        id: 'fun-7',
        text: 'Coffee or tea?',
        widgetType: 'fun',
      },
      {
        id: 'fun-easter',
        text: "What's your most embarrassing tech moment? 🔐",
        easterEgg: true,
        widgetType: 'fun',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact & Future',
    icon: <IconMail className="w-5 h-5" />,
    emoji: '📧',
    questions: [
      {
        id: 'contact-1',
        text: 'How can I reach you? 📬',
        featured: true,
        widgetType: 'contact',
      },
      {
        id: 'contact-2',
        text: "Let's work together! 🤝",
        featured: true,
        widgetType: 'contact',
      },
      {
        id: 'contact-3',
        text: "What kind of project would make you say 'yes' immediately?",
        widgetType: 'contact',
      },
      {
        id: 'contact-4',
        text: 'Where are you located?',
        widgetType: 'contact',
      },
      {
        id: 'contact-5',
        text: 'Are you open to opportunities?',
        widgetType: 'contact',
      },
      {
        id: 'contact-6',
        text: "What's your ideal next role?",
        widgetType: 'contact',
      },
      {
        id: 'contact-easter',
        text: 'What would make you relocate? 🔐',
        easterEgg: true,
        widgetType: 'contact',
      },
    ],
  },
];

// Welcome carousel sets (compact horizontal pills with pagination)
// Used by WelcomeSuggestions - more questions, carousel layout
export interface WelcomeCarouselItem {
  id: string;
  text: string;
  emoji: string;
  widgetType?: WidgetType;
  action?: 'random' | 'tour' | 'everything' | 'secret';
}

export const welcomeCarouselSets: WelcomeCarouselItem[][] = [
  [
    { id: 'wc-1', text: 'Who are you?', emoji: '✨', widgetType: 'me' },
    { id: 'wc-2', text: 'Show me projects', emoji: '🚀', widgetType: 'projects' },
    { id: 'wc-3', text: "What's your superpower?", emoji: '💪', widgetType: 'skills' },
    { id: 'wc-4', text: 'Surprise me!', emoji: '🎲', action: 'random' },
  ],
  [
    { id: 'wc-5', text: 'Your background?', emoji: '📚', widgetType: 'experience' },
    { id: 'wc-6', text: 'Something fun', emoji: '🎨', widgetType: 'fun' },
    { id: 'wc-7', text: "Let's connect", emoji: '💬', widgetType: 'contact' },
    { id: 'wc-8', text: 'Quick tour', emoji: '🚶', action: 'tour' },
  ],
  [
    { id: 'wc-9', text: 'Can I see your resume?', emoji: '📄', widgetType: 'experience' },
    { id: 'wc-10', text: 'What projects are you proud of?', emoji: '🎯', widgetType: 'projects' },
    { id: 'wc-11', text: "What's your tech stack?", emoji: '🛠️', widgetType: 'skills' },
    { id: 'wc-12', text: 'Tell me a secret', emoji: '🔐', action: 'secret' },
  ],
  [
    { id: 'wc-13', text: "Why should I hire you?", emoji: '⚡', widgetType: 'experience' },
    { id: 'wc-14', text: "What's the craziest thing you've done?", emoji: '🤯', widgetType: 'fun' },
    { id: 'wc-15', text: 'How can I reach you?', emoji: '📬', widgetType: 'contact' },
    { id: 'wc-16', text: 'Show everything', emoji: '✨', action: 'everything' },
  ],
  [
    { id: 'wc-17', text: "What makes you tick?", emoji: '💭', widgetType: 'me' },
    { id: 'wc-18', text: 'Show me something impressive', emoji: '🎯', widgetType: 'projects' },
    { id: 'wc-19', text: "What are you learning?", emoji: '🧠', widgetType: 'skills' },
    { id: 'wc-20', text: "Let's work together", emoji: '🤝', widgetType: 'contact' },
  ],
];

// Get all questions (used for random selection)
export function getAllQuestions(): Question[] {
  return questionSections.flatMap(section => section.questions);
}

// Get a random question
export function getRandomQuestion(): Question {
  const allQuestions = getAllQuestions().filter(q => !q.easterEgg);
  return allQuestions[Math.floor(Math.random() * allQuestions.length)];
}

// Get a random easter egg question
export function getRandomEasterEgg(): Question {
  const easterEggs = getAllQuestions().filter(q => q.easterEgg);
  return easterEggs[Math.floor(Math.random() * easterEggs.length)];
}
