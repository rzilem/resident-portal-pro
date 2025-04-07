
/**
 * Preset greeting options for voice greetings
 */

export const PRESET_GREETINGS = [
  {
    id: 'formal',
    title: 'Formal',
    text: 'Welcome back. Your community dashboard is ready for your review.',
  },
  {
    id: 'casual',
    title: 'Casual',
    text: 'Hey there {name}! Great to see you again. Your dashboard is all set.',
  },
  {
    id: 'professional',
    title: 'Professional',
    text: 'Welcome to your community management dashboard, {name}. Today\'s updates are ready for your review.',
  },
  {
    id: 'friendly',
    title: 'Friendly',
    text: 'Hello {name}! Hope you\'re having a great day. Your community dashboard is ready.',
  },
  {
    id: 'minimal',
    title: 'Minimal',
    text: 'Dashboard ready, {name}.',
  },
];

/**
 * Get greeting text by ID
 */
export const getPresetGreetingById = (id: string): string | undefined => {
  const preset = PRESET_GREETINGS.find(greeting => greeting.id === id);
  return preset?.text;
};
