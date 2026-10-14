# HARDMODE — Comfort zone-dan çıx

İntizam və özünü inkişaf üçün mobil tətbiq (iOS + Android). Expo / React Native ilə qurulub.

## Funksiyalar

| Ekran | Nə edir |
|---|---|
| **Today** | Hər gün 1 komfort zonadan çıxaran çağırış (hamı üçün eyni, dəyişmək olmur), streak, intizam xalı, rütbə/XP, günün sitatı, “I want to quit” düyməsi |
| **Habits** | Öz gündəlik vərdişlərin (pulsuz: 3, Premium: limitsiz) |
| **Vault** | “Victory Vault” — qələbələr jurnalı. Təslim olmaq istəyəndə sənə keçmiş qələbələrini göstərir |
| **Progress** | Streak, ən uzun streak, intizam xalı, tarixçə xəritəsi, rütbələr (Recruit → Legend) |
| **Paywall** | Premium abunəlik (RevenueCat ilə) |
| **Settings** | Gündəlik bildiriş (push xatırlatma), məlumatları sıfırlama |

**Premium (pul qazandıran hissə):** Hard Mode (gündə 2-ci, daha ağır çağırış), limitsiz vərdiş, 12 həftəlik tarixçə.

Bütün məlumatlar telefonda saxlanılır (server lazım deyil).

## Kodun strukturu

```
src/app/            ekranlar (Expo Router — hər fayl bir ekrandır)
  (tabs)/           alt menyudakı 4 ekran
  onboarding.tsx    ilk açılış
  paywall.tsx       Premium satış ekranı
src/data/           çağırışlar, sitatlar, rütbələr — mətnləri buradan dəyiş
src/state/store.tsx bütün məlumat və hesablamalar (streak, XP, intizam xalı)
src/lib/            ödəniş (RevenueCat), bildirişlər
src/theme.ts        rənglər
```

Yeni çağırış əlavə etmək üçün sadəcə `src/data/challenges.ts` faylına sətir əlavə et.

---

## 1. Kompüterdə işə salmaq

Lazımdır: [Node.js](https://nodejs.org) (LTS versiya).

```bash
cd hardmode-app
npm install
npx expo start
```

Telefona **Expo Go** tətbiqini yüklə (App Store / Google Play) və ekrandakı QR kodu skan et. Tətbiq telefonda açılacaq.

> Expo Go-da ödəniş (abunəlik) işləmir — bu normaldır. Ödənişi yoxlamaq üçün aşağıdakı “development build” lazımdır.

## 2. App Store / Google Play-ə çıxarmaq — addım-addım

### a) Hesablar (bir dəfəlik)
1. **Apple Developer Program** — ildə $99 — https://developer.apple.com/programs/
2. **Google Play Console** — bir dəfəlik $25 — https://play.google.com/console
3. **Expo hesabı** (pulsuz) — https://expo.dev/signup
4. **RevenueCat hesabı** (aylıq gəlir $2,500-ə qədər pulsuz) — https://app.revenuecat.com

### b) Tətbiqin adı və ID-si
`app.json` faylında dəyiş:
- `"name"` — mağazada görünən ad
- `"bundleIdentifier"` (iOS) və `"package"` (Android) — `com.yourname.hardmode` əvəzinə öz unikal ID-n (məs. `com.nurali.hardmode`). Mağazaya çıxandan sonra bu dəyişdirilə bilməz.

`assets/` qovluğundakı ikonları öz dizaynınla əvəz et (`icon.png` 1024×1024).

### c) Abunəlikləri yarat
1. **App Store Connect** → tətbiqi yarat → *Subscriptions* → bir qrup yarat, məsələn:
   - `hardmode_monthly` — $4.99 / ay
   - `hardmode_yearly` — $29.99 / il (+ 7 günlük pulsuz sınaq tövsiyə olunur)
2. **Google Play Console** → *Monetize → Subscriptions* → eyni məhsulları yarat.
3. **RevenueCat**-də:
   - Layihə yarat, iOS və Android tətbiqlərini əlavə et
   - *Entitlements* → `premium` adlı entitlement yarat (ad məhz belə olmalıdır)
   - *Products* → yuxarıdakı məhsulları əlavə et və `premium`-a bağla
   - *Offerings* → `default` offering-ə Monthly və Annual paketlərini əlavə et
   - *API keys* bölməsindən iOS və Android **public** açarlarını götür
4. `.env.example` faylını `.env` adı ilə kopyala və açarları yaz. Həmçinin Gizlilik Siyasəti (Privacy Policy) linkini əlavə et — Apple bunu tələb edir.

### d) Build və göndərmə (EAS — Mac lazım deyil)
```bash
npm install -g eas-cli
eas login
eas init                                     # layihəni Expo hesabına bağlayır

# Ödənişi öz telefonunda test etmək üçün:
eas build --profile development --platform ios      # və ya android

# Mağaza üçün:
eas build --profile production --platform all
eas submit --platform ios
eas submit --platform android
```

`.env` faylı git-ə düşmür; EAS build-ə açarları ötürmək üçün onları Expo saytında
*Project → Environment variables* bölməsinə də əlavə et (eyni adlarla).

### e) Mağaza səhifəsi
- Ekran şəkilləri (iPhone 6.7" və 6.5", Android telefon)
- Təsvir, açar sözlər (discipline, habit tracker, self improvement, comfort zone, cold shower, motivation)
- Yaş reytinqi, Privacy anketi (“Data Not Collected” — tətbiq məlumat toplamır; RevenueCat yalnız alış məlumatını emal edir)

## Pul qazanma strategiyası — tövsiyələr
- **İllik plan + 7 gün pulsuz sınaq** — bu kateqoriyada ən yaxşı çevrilmə budur.
- Paywall-u istifadəçi ilk günü qazandıqdan sonra göstərmək (motivasiya ən yüksək olanda) çevrilməni artırır.
- TikTok / Instagram Reels-də “30 günlük komfort zona çağırışı” kontenti — bu niş üçün ən ucuz trafik mənbəyidir.

## Yoxlama əmrləri
```bash
npm run typecheck     # TypeScript yoxlaması
npx expo-doctor       # asılılıq problemlərini yoxlayır
```

## Qeyd
Çağırışlar və sitatlar orijinal mətnlərdir. Mağaza adında və marketinqdə başqalarının qeydiyyatdan keçmiş ifadələrindən
(məs. məşhur şəxslərin adları və ya “Stay Hard” kimi ticarət nişanları) istifadə etmə — Apple tətbiqi buna görə rədd edə bilər.
