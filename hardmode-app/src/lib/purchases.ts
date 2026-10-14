import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

/**
 * In-app subscriptions via RevenueCat (https://www.revenuecat.com).
 * Set your public SDK keys in `.env` (see `.env.example`), and create an
 * entitlement with this identifier in the RevenueCat dashboard.
 */
export const ENTITLEMENT_ID = 'premium';

const API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
});

let configured = false;

export function purchasesAvailable() {
  return configured;
}

export function initPurchases() {
  if (configured || !API_KEY || Platform.OS === 'web') return false;
  try {
    Purchases.configure({ apiKey: API_KEY });
    configured = true;
  } catch (e) {
    console.warn('RevenueCat configure failed', e);
  }
  return configured;
}

export const hasPremium = (info: CustomerInfo) => !!info.entitlements.active[ENTITLEMENT_ID];

export async function fetchPremium(): Promise<boolean | null> {
  if (!configured) return null;
  try {
    return hasPremium(await Purchases.getCustomerInfo());
  } catch {
    return null;
  }
}

export function onPremiumChange(cb: (premium: boolean) => void) {
  if (!configured) return () => {};
  const listener = (info: CustomerInfo) => cb(hasPremium(info));
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
}

export async function fetchPackages(): Promise<PurchasesPackage[]> {
  if (!configured) return [];
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages ?? [];
}

/** Returns true if premium is active after the purchase; false if the user cancelled. */
export async function buy(pkg: PurchasesPackage): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return hasPremium(customerInfo);
  } catch (e: any) {
    if (e?.userCancelled) return false;
    throw e;
  }
}

export async function restore(): Promise<boolean> {
  return hasPremium(await Purchases.restorePurchases());
}
