import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FileText, Plus } from 'lucide-react-native';

interface EmptyStateProps {
  onCreateNote: () => void;
}

export default function EmptyState({ onCreateNote }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <FileText size={40} color="#94A3B8" />
      </View>

      <Text style={styles.title}>No notes yet</Text>
      <Text style={styles.subtitle}>
        Create your first note to start capturing your thoughts and ideas.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onCreateNote}>
        <Plus size={16} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.buttonText}>Create note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2596BE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
