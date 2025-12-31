import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
// import { useToast } from './use-toast';
import { supabase } from '../config/supabase';

export interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotes = async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      setNotes(data || []);
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        'Failed to fetch notes. Please check your connection.';
      setError(errorMessage);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const createNote = async (title: string, content: string) => {
    if (!user) return null;

    try {
      const { data, error: createError } = await supabase
        .from('notes')
        .insert({
          title,
          content,
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      setNotes((prev) => [data, ...prev]);
      setError(null);
      return data;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create note';
      setError(errorMessage);
      return null;
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setNotes((prev) => prev.map((note) => (note.id === id ? data : note)));
      setError(null);
      return data;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update note';
      setError(errorMessage);
      return null;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setNotes((prev) => prev.filter((note) => note.id !== id));
      setError(null);
      return true;
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete note';
      setError(errorMessage);
      return false;
    }
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  };
}
