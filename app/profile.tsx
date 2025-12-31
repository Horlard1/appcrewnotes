import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

function MainProfile() {
  const { user, loading: authLoading, signOut } = useAuth();

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.back();
  };

  if (!user) return null;

  const joinedDate = user.created_at
    ? format(new Date(user.created_at), 'MMM dd, yyyy')
    : '—';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Joined</Text>
          <Text style={styles.value}>{joinedDate}</Text>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          {authLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signOutText}>Sign out</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function Profile() {
  return (
    <AuthProvider>
      <MainProfile />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#111827',
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
