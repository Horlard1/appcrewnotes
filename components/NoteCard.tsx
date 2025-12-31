import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Note, useNotes } from '../hooks/useNotes';
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { CalendarIcon, Trash2 } from 'lucide-react-native';
import { estimateReadTime } from '@/lib/util';
import { ConfirmModal } from './common/DeleteModal';

interface NoteCardProps {
  note: Note;
  onSelect: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onSelect, onDelete }: NoteCardProps) {
  const { deleteNote } = useNotes();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await deleteNote(note.id);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => onSelect(note)}
      >
        <View style={styles.row}>
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {note.title || 'Untitled'}
            </Text>
            <Text style={styles.body} numberOfLines={2}>
              {note.content || 'No content'}
            </Text>
          </View>

          <Pressable onPress={() => setOpen(true)} style={styles.deleteButton}>
            <Trash2 size={20} color="#DC2626" />
          </Pressable>
        </View>
        <View
          style={[
            styles.options,
            { marginTop: 10, justifyContent: 'space-between' },
          ]}
        >
          <View style={styles.options}>
            <View style={[styles.options, { gap: 3 }]}>
              <CalendarIcon size={10} />
              <Text style={styles.updatedAt}>
                {formatDistanceToNow(new Date(note.created_at), {
                  addSuffix: true,
                })}
              </Text>
            </View>
            <Text style={styles.updatedAt}>
              {estimateReadTime(note)?.label}
            </Text>
          </View>
          <Text style={[styles.updatedAt, { fontSize: 10 }]}>
            Last saved:{' '}
            {formatDistanceToNowStrict(new Date(note.updated_at), {
              addSuffix: true,
            })}
          </Text>
        </View>
      </TouchableOpacity>
      <ConfirmModal
        visible={open}
        title="Delete note?"
        message="This action cannot be undone."
        confirmText={loading ? 'Deleting...' : 'Delete'}
        destructive
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0F172A',
  },
  body: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  updatedAt: {
    fontSize: 12,
    color: '#94A3B8',
  },
  options: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});
