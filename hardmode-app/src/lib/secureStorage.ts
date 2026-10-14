import AsyncStorage from '@react-native-async-storage/async-storage';
import { aesDecryptAsync, aesEncryptAsync, AESEncryptionKey, AESKeySize, AESSealedData } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Encrypted app storage.
 *
 * The app data is encrypted with AES-256-GCM and stored in AsyncStorage. The
 * key never leaves the device's secure hardware-backed store (iOS Keychain /
 * Android Keystore), so the data file alone is unreadable and tamper-evident.
 * Web (used only for local testing) has no secure store and falls back to
 * plain storage.
 */
const DATA_KEY = 'hardmode:v2';
const LEGACY_DATA_KEY = 'hardmode:v1';
const KEY_NAME = 'hardmode.dataKey';

const encrypted = Platform.OS !== 'web';

let keyPromise: Promise<AESEncryptionKey> | null = null;

function getKey() {
  keyPromise ??= (async () => {
    const stored = await SecureStore.getItemAsync(KEY_NAME);
    if (stored) return AESEncryptionKey.import(stored, 'base64');
    const key = await AESEncryptionKey.generate(AESKeySize.AES256);
    await SecureStore.setItemAsync(KEY_NAME, await key.encoded('base64'));
    return key;
  })();
  keyPromise.catch(() => (keyPromise = null));
  return keyPromise;
}

// TextEncoder/TextDecoder with a fallback for JS engines that lack them.
function utf8Encode(s: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s);
  const bin = unescape(encodeURIComponent(s));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function utf8Decode(b: Uint8Array): string {
  if (typeof TextDecoder !== 'undefined') return new TextDecoder().decode(b);
  let bin = '';
  for (let i = 0; i < b.length; i++) bin += String.fromCharCode(b[i]);
  return decodeURIComponent(escape(bin));
}

export async function loadData<T>(): Promise<T | null> {
  if (!encrypted) {
    const raw = (await AsyncStorage.getItem(DATA_KEY)) ?? (await AsyncStorage.getItem(LEGACY_DATA_KEY));
    return raw ? JSON.parse(raw) : null;
  }

  const sealed = await AsyncStorage.getItem(DATA_KEY);
  if (sealed) {
    // If the secure store itself fails, this throws and the caller must not save over the data.
    const key = await getKey();
    try {
      const bytes = await aesDecryptAsync(AESSealedData.fromCombined(sealed), key, { output: 'bytes' });
      return JSON.parse(utf8Decode(bytes));
    } catch {
      // Wrong key (e.g. restored to a new phone without the Keychain) or corrupted data:
      // keep the unreadable copy aside instead of destroying it, and start fresh.
      await AsyncStorage.setItem(`${DATA_KEY}:unreadable`, sealed);
      return null;
    }
  }

  // One-time migration from the unencrypted v1 format; saveData() removes it.
  const legacy = await AsyncStorage.getItem(LEGACY_DATA_KEY);
  return legacy ? JSON.parse(legacy) : null;
}

let writeQueue: Promise<void> = Promise.resolve();

/** Saves are queued so a slow encryption can never overwrite a newer state. */
export function saveData(data: unknown): Promise<void> {
  writeQueue = writeQueue
    .catch(() => {})
    .then(async () => {
      const json = JSON.stringify(data);
      if (!encrypted) return AsyncStorage.setItem(DATA_KEY, json);
      const sealed = await aesEncryptAsync(utf8Encode(json), await getKey());
      await AsyncStorage.setItem(DATA_KEY, await sealed.combined('base64'));
      await AsyncStorage.removeItem(LEGACY_DATA_KEY);
    });
  return writeQueue;
}
