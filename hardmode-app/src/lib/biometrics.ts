import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

/** True when the phone has Face ID / fingerprint / a passcode the app can ask for. */
export async function canUseAppLock(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const level = await LocalAuthentication.getEnrolledLevelAsync();
    return level !== LocalAuthentication.SecurityLevel.NONE;
  } catch {
    return false;
  }
}

/** Shows the system Face ID / fingerprint prompt, falling back to the device passcode. */
export async function authenticate(reason = 'Unlock HARDMODE'): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });
    return result.success;
  } catch {
    return false;
  }
}
