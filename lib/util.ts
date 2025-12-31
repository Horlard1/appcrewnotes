import { Note } from '@/hooks/useNotes';

export function estimateReadTime(note: Note, wordsPerMinute = 20) {
  const text = `${note.title ?? ''} ${note.content ?? ''}`.trim();

  if (!text) {
    return {
      minutes: 0,
      words: 0,
      label: 'Less than a minute',
    };
  }

  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return {
    minutes,
    words,
    label: `${minutes} min read`,
  };
}
