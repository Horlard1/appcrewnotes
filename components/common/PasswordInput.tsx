import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function PasswordInput({
  label = 'Password',
  value,
  onChangeText,
  placeholder = '••••••••',
  error,
}: PasswordInputProps) {
  const [secure, setSecure] = useState(true);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={secure}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />

        <Pressable onPress={() => setSecure(!secure)} style={styles.iconButton}>
          {secure ? (
            <Eye size={18} color="#64748B" />
          ) : (
            <EyeOff size={18} color="#64748B" />
          )}
        </Pressable>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#334155',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 44,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  iconButton: {
    paddingLeft: 8,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#DC2626',
  },
});
