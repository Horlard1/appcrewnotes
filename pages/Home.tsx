import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useNotes, Note } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import EmptyState from '../components/EmptyState';
import { FileText, Plus, UserIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function NotesScreen() {
  const { user, loading: authLoading } = useAuth();
  const {
    notes,
    loading: notesLoading,
    createNote,
    updateNote,
    deleteNote,
    refetch,
  } = useNotes();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  const handleBack = () => {
    setSelectedNote(null);
    setIsCreating(false);
  };

  const handleSave = async (title: string, content: string) => {
    if (isCreating) return await createNote(title, content);
    if (selectedNote) return await updateNote(selectedNote.id, title, content);
    return null;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  if (authLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2596BE" />
      </View>
    );
  }

  if (!user) return null;

  const showEditor = selectedNote || isCreating;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {!showEditor && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconWrapper}>
              <FileText size={24} color="#2596BE" />
            </View>
            <View>
              <Text style={styles.title}>Notes</Text>
              <Text style={styles.subtitle}>{notes.length} notes</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleCreateNote}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>

            <Link href="/profile">
              <View style={[styles.iconButton, styles.logoutButton]}>
                <UserIcon size={20} color="#000" />
              </View>
            </Link>
          </View>
        </View>
      )}

      <View style={styles.container}>
        {!showEditor ? (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#2596BE"
              />
            }
          >
            {notesLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color="#2596BE" />
              </View>
            ) : notes.length === 0 ? (
              <EmptyState onCreateNote={handleCreateNote} />
            ) : (
              notes.map((note) => (
                <View key={note.id} style={{ marginBottom: 12 }}>
                  <NoteCard
                    note={note}
                    onSelect={handleSelectNote}
                    onDelete={handleDelete}
                  />
                </View>
              ))
            )}
          </ScrollView>
        ) : (
          <NoteEditor
            note={selectedNote}
            onSave={handleSave}
            onBack={handleBack}
            isNew={isCreating}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(109,40,217,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2596BE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#eee',
  },
  scrollContainer: {
    padding: 16,
  },
});
