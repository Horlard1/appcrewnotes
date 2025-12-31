import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { FileText } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import PasswordInput from '@/components/common/PasswordInput';

const authSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.confirmPassword) return true;
      return data.password === data.confirmPassword;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  );

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [authError, setAuthError] = useState<string | null>(null);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: {
          email?: string;
          password?: string;
          confirmPassword?: string;
        } = {};
        error.issues.forEach((err: any) => {
          if (err.path[0] === 'email') fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
          if (err.path[0] === 'confirmPassword')
            fieldErrors.confirmPassword = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    setAuthError(null);
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        if (error.message.includes('already registered')) {
          setAuthError(
            'This email is already registered. Please log in instead.'
          );
        } else if (error.message.includes('Invalid login credentials')) {
          setAuthError('Invalid email or password.');
        } else {
          setAuthError(error.message);
        }
      }

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.container}>
              <View style={styles.cardWrapper}>
                <View style={styles.header}>
                  <View style={styles.iconWrapper}>
                    <FileText size={32} color="#2596BE" />
                  </View>

                  <Text style={styles.title}>Notes</Text>
                  <Text style={styles.subtitle}>
                    {isLogin ? 'Welcome back' : 'Create your account'}
                  </Text>
                </View>

                <View style={styles.card}>
                  <View style={styles.field}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="you@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                    {errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <PasswordInput
                    value={password}
                    onChangeText={setPassword}
                    error={errors.password}
                  />

                  {!isLogin && (
                    <PasswordInput
                      label="Confirm Password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      error={errors.confirmPassword}
                    />
                  )}

                  {authError && (
                    <View style={styles.authErrorBox}>
                      <Text style={styles.errorText}>{authError}</Text>
                    </View>
                  )}

                  <Pressable
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>
                        {isLogin ? 'Log in' : 'Sign up'}
                      </Text>
                    )}
                  </Pressable>

                  {/* Toggle */}
                  <View style={styles.footer}>
                    <TouchableOpacity
                      onPress={() => {
                        setIsLogin(!isLogin);
                        setAuthError(null);
                        setErrors({});
                      }}
                    >
                      <Text style={styles.footerText}>
                        {isLogin
                          ? "Don't have an account? "
                          : 'Already have an account? '}
                        <Text style={styles.footerLink}>
                          {isLogin ? 'Sign up' : 'Log in'}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
  },

  cardWrapper: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(109, 40, 217, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#334155',
    fontWeight: '500',
  },

  input: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#DC2626',
  },

  authErrorBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
    marginBottom: 16,
  },

  button: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#2596BE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  footer: {
    marginTop: 24,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 13,
    color: '#64748B',
  },

  footerLink: {
    color: '#2596BE',
    fontWeight: '600',
  },
});
