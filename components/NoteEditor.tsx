import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Note } from '../hooks/useNotes';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useToast } from '@/hooks/useToast';

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string) => Promise<any>;
  onBack: () => void;
  isNew?: boolean;
}

export default function NoteEditor({
  note,
  onSave,
  onBack,
  isNew = false,
}: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setHasChanges(false);
    } else {
      setTitle('');
      setContent('');
      setHasChanges(false);
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    try {
      const result = await onSave(title || 'Untitled', content);
      setSaving(false);

      if (result && isNew) {
        onBack();
        showToast('New note created successfully', 'success');
      } else {
        setHasChanges(false);
        showToast('Note saved successfully', 'success');
      }
    } catch (error) {
      setSaving(false);
      if (note) {
        showToast('Failed to save note', 'error');
      } else {
        showToast('Failed to create new note', 'error');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={20} color="#0F172A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (saving || (!hasChanges && !isNew)) && { opacity: 0.6 },
          ]}
          onPress={handleSave}
          disabled={saving || (!hasChanges && !isNew)}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={{ marginRight: 8 }}
            />
          ) : (
            <Save size={20} color="#fff" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.saveText}>{isNew ? 'Create' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.editorContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Note title..."
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setHasChanges(true);
          }}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Start writing..."
          placeholderTextColor="#94A3B8"
          multiline
          value={content}
          onChangeText={(text) => {
            setContent(text);
            setHasChanges(true);
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2596BE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  editorContainer: {
    padding: 16,
    flexGrow: 1,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#0F172A',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 22,
    color: '#0F172A',
    flex: 1,
    minHeight: 400,
    textAlignVertical: 'top',
  },
});
