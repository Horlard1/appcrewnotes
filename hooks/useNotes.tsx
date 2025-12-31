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
  const { user } = useAuth();
  //   const { toast } = useToast();

  const fetchNotes = async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      //   toast({
      //     title: 'Error fetching notes',
      //     description: error.message,
      //     variant: 'destructive',
      //   });
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
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title,
          content,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setNotes((prev) => [data, ...prev]);
      //   toast({
      //     title: 'Note created',
      //     description: 'Your note has been saved.',
      //   });
      return data;
    } catch (error: any) {
      //   toast({
      //     title: 'Error creating note',
      //     description: error.message,
      //     variant: 'destructive',
      //   });
      return null;
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setNotes((prev) => prev.map((note) => (note.id === id ? data : note)));
      //   toast({
      //     title: 'Note updated',
      //     description: 'Your changes have been saved.',
      //   });
      return data;
    } catch (error: any) {
      //   toast({
      //     title: 'Error updating note',
      //     description: error.message,
      //     variant: 'destructive',
      //   });
      return null;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);

      if (error) throw error;

      setNotes((prev) => prev.filter((note) => note.id !== id));
      //   toast({
      //     title: 'Note deleted',
      //     description: 'Your note has been removed.',
      //   });
      return true;
    } catch (error: any) {
      //   toast({
      //     title: 'Error deleting note',
      //     description: error.message,
      //     variant: 'destructive',
      //   });
      return false;
    }
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  };
}
