import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TextInput,
  BackHandler,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useNotes, Note } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import EmptyState from '../components/EmptyState';
import { FileText, Plus, UserIcon, Search, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function NotesScreen() {
  const { user, loading: authLoading } = useAuth();
  const {
    notes,
    loading: notesLoading,
    error: notesError,
    createNote,
    updateNote,
    deleteNote,
    refetch,
  } = useNotes();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes;
    }
    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

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

  const showEditor = selectedNote || isCreating;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (showEditor) {
          handleBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [showEditor]);

  if (authLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2596BE" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {!showEditor && (
        <>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconWrapper}>
                <FileText size={24} color="#2596BE" />
              </View>
              <View>
                <Text style={styles.title}>Notes</Text>
                {notes?.length ? (
                  <Text style={styles.subtitle}>
                    {notes.length} note{notes?.length > 1 ? 's' : ''}
                  </Text>
                ) : null}
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

          {notes.length > 0 && !notesError && (
            <View style={styles.searchContainer}>
              <Search size={18} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search notes by title..."
                placeholderTextColor="#A1A5B0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </>
      )}

      <View style={styles.container}>
        {!showEditor ? (
          <>
            {notesLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color="#2596BE" />
              </View>
            ) : notesError ? (
              <FlatList
                data={[]}
                renderItem={() => null}
                keyExtractor={() => ''}
                ListEmptyComponent={
                  <View style={styles.errorContainer}>
                    <View style={styles.errorBox}>
                      <Text style={styles.errorTitle}>⚠️ Connection Error</Text>
                      <Text style={styles.errorMessage}>{notesError}</Text>
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={handleRefresh}
                        disabled={refreshing}
                      >
                        <Text style={styles.retryButtonText}>
                          {refreshing ? 'Retrying...' : 'Retry'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#2596BE"
                  />
                }
              />
            ) : notes.length === 0 ? (
              <FlatList
                data={[]}
                renderItem={() => null}
                keyExtractor={() => ''}
                ListEmptyComponent={
                  <EmptyState onCreateNote={handleCreateNote} />
                }
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#2596BE"
                  />
                }
              />
            ) : filteredNotes.length === 0 ? (
              <FlatList
                data={[]}
                renderItem={() => null}
                keyExtractor={() => ''}
                ListEmptyComponent={
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      No notes match "{searchQuery}"
                    </Text>
                  </View>
                }
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#2596BE"
                  />
                }
              />
            ) : (
              <FlatList
                data={filteredNotes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 12 }}>
                    <NoteCard
                      note={item}
                      onSelect={handleSelectNote}
                      onDelete={handleDelete}
                    />
                  </View>
                )}
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#2596BE"
                  />
                }
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  noResultsText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#991B1B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
