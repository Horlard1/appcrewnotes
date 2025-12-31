import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title = 'Confirm action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <>
      {visible && (
        <StatusBar
          translucent
          backgroundColor="rgba(0,0,0,0.45)"
          barStyle="light-content"
        />
      )}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.message}>{message}</Text>

            <View style={styles.actions}>
              <Pressable onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </Pressable>

              <Pressable
                onPress={onConfirm}
                style={[
                  styles.confirmButton,
                  destructive && styles.destructiveButton,
                ]}
              >
                <Text style={styles.confirmText}>{confirmText}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    inset: 0,
  },

  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  cancelText: {
    fontSize: 14,
    color: '#666',
  },

  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#000',
    marginLeft: 8,
  },

  destructiveButton: {
    backgroundColor: '#D92D20',
  },

  confirmText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
