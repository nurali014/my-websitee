import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Modal, Platform, StyleSheet, Text, View } from 'react-native';

import { authenticate } from '../lib/biometrics';
import { useStore } from '../state/store';
import { colors } from '../theme';
import { Button, styles as ui } from './ui';

/**
 * Covers the whole app with a lock screen when App Lock is on. The app locks
 * on launch and every time it goes to the background, and unlocks only after
 * a successful Face ID / fingerprint / passcode check.
 */
export function LockGate() {
  const { ready, data } = useStore();
  const enabled = ready && data.lockEnabled && Platform.OS !== 'web';
  const [locked, setLocked] = useState(true);
  const prompting = useRef(false);

  const unlock = useCallback(async () => {
    if (prompting.current) return;
    prompting.current = true;
    const ok = await authenticate();
    prompting.current = false;
    if (ok) setLocked(false);
  }, []);

  // Lock whenever the app is sent to the background. ("inactive" is ignored: the
  // Face ID prompt itself makes the app briefly inactive on iOS.)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (!enabled) return;
      if (state === 'background') setLocked(true);
      else if (state === 'active') unlock();
    });
    return () => sub.remove();
  }, [enabled, unlock]);

  // On launch: prompt if App Lock is on. If it is off, stay unlocked — so turning it on
  // in Settings (which already verified the user) doesn't immediately lock the app.
  useEffect(() => {
    if (!ready) return;
    if (data.lockEnabled) unlock();
    else setLocked(false);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!enabled || !locked) return null;

  // A native Modal so the lock also covers screens presented as modals (paywall, etc.).
  return (
    <Modal visible animationType="none" statusBarTranslucent onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <Ionicons name="lock-closed" size={48} color={colors.accent} />
        <Text style={[ui.title, { textAlign: 'center' }]}>HARDMODE is locked</Text>
        <Text style={[ui.body, { textAlign: 'center' }]}>Unlock with Face ID, fingerprint, or your passcode.</Text>
        <View style={{ alignSelf: 'stretch', marginTop: 12 }}>
          <Button title="Unlock" icon="finger-print" onPress={unlock} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
});
