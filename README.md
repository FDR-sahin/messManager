# MessManager — Flat/Mess Management System

React + Tailwind + Redux + React Router + Framer Motion + Firebase diye toiri full-stack app. 9 jon flatmate-er bazar khoroch, bill, ar notice track korar jonno.

## Features

- Admin login kore: member add/manage, bazar entry, bill management, notice post
- Member login kore: nijer bazar/bill dekha, complaint janano
- Bill due date 3 diner moddhe ese gele automatic email reminder (Cloud Function diye)
- Smooth animation (Framer Motion) — page transition, number count-up, modal

---

## STEP 1: Firebase Project Setup

Apnar already Firebase account ache, toh:

1. https://console.firebase.google.com e jan, notun project banান (jodi already na thake)
2. Project er moddhe "Build" menu theke **Authentication** e jan
   - "Get Started" click korun
   - "Email/Password" provider **enable** korun
3. "Build" menu theke **Firestore Database** e jan
   - "Create database" click korun
   - Location select korun (asia-southeast1 — Singapore, Bangladesh-er kache)
   - "Start in production mode" select korun
4. Project Settings (gear icon, top-left) e jan
   - "Your apps" section e "</>" (Web) icon click korun
   - App-er nickname din (jemon: mess-manager-web)
   - "Register app" click korun
   - Apnar **firebaseConfig** object ta dekhte পাবেন — eta copy kore rakhun, ei jinish ta porer step e lagbe

---

## STEP 2: Project Setup (Apnar Computer-e)

```bash
npm install
```

Tarpor `.env.example` file ta copy kore `.env` name e save korun:

```bash
cp .env.example .env
```

`.env` file ta open kore Step 1-e copy kora **firebaseConfig** er value gulo diye fill up korun:

```
VITE_FIREBASE_API_KEY=apnar_api_key
VITE_FIREBASE_AUTH_DOMAIN=apnar-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=apnar-project-id
VITE_FIREBASE_STORAGE_BUCKET=apnar-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

Tarpor run korun:

```bash
npm run dev
```

Browser e `http://localhost:5173` open korun.

---

## STEP 3: Firestore Security Rules Set Korun

Eta **na korle apnar database open thakbe, jekono manush data dekhte/change korte parbe** — toh eta skip korben na.

1. Firebase Console e jan -> Firestore Database -> "Rules" tab
2. Ei project-er `firestore.rules` file-er content ta copy kore Firebase Console-er Rules editor e paste korun
3. "Publish" click korun

---

## STEP 4: Prothom Admin Account Banano

Apnar app-e ekhono kono user nei, toh prothom admin account ta **Firebase Console theke direct** banate hobe:

1. Firebase Console -> Authentication -> "Add user"
2. Email ar password din (eta hobe admin login)
3. Tarpor Firestore Database -> "Start collection" -> collection name: `members`
4. Document ID hisebe shei user-er **UID** ta din (Authentication tab theke copy korte parben)
5. Field add korun:
   - `name` (string): Apnar naam
   - `email` (string): Shei email
   - `role` (string): `admin`
   - `createdAt` (string): aj-er date, jemon `2026-06-21`
6. Save korun

Ekhon ei email/password diye apnar app-e login korte parben **admin** hisebe. Login korar pore Admin Panel theke baki 8 jon member add korte parben (eta automatic Authentication + Firestore duitate add hobe).

---

## STEP 5 (Optional): Email Reminder Cloud Function Deploy Korun

Eta **optional** — na korleo app-er baki shob feature thik moto kaj korbe, shudhu automatic email reminder pabe na.

Email reminder cholar jonno Firebase-er **Blaze plan** (pay-as-you-go) lagbe, karon scheduled functions free (Spark) plan e nei. Blaze plan e free quota onek boro, normally 9 jon-er chhoto app-er jonno bill ashbe na, kintu eta janar jonno bole rakha valo.

1. Firebase Console -> "Upgrade" -> Blaze plan select korun
2. Terminal e Firebase CLI install korun (jodi na thake):
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
3. Project root e (ei folder-e) eshe:
   ```bash
   firebase use --add
   ```
   Apnar Firebase project select korun.

4. **Gmail App Password** banান email pathanor jonno:
   - https://myaccount.google.com/security e jan
   - "2-Step Verification" on korun
   - "App passwords" e jan, notun password generate korun (16 digit-er code pabe)

5. Eai command diye Gmail credential Cloud Function-e set korun:
   ```bash
   firebase functions:secrets:set GMAIL_EMAIL
   ```
   (eta likhle apnar gmail address chaibe, type kore enter dিন)
   ```bash
   firebase functions:secrets:set GMAIL_APP_PASSWORD
   ```
   (eai 16 digit app password ta dিন)

6. `functions/index.js` file-e function definition-e secrets add korte hobe — `onSchedule` er options object-e ei line ta add korun:
   ```js
   secrets: ["GMAIL_EMAIL", "GMAIL_APP_PASSWORD"],
   ```

7. Deploy korun:
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

Deploy hoye gele, proti din shokal 9 tay (Bangladesh time) automatic check hobe — kar bill 3 diner moddhe due, tader email jabe.

---

## Project Structure

```
src/
├── firebase/
│   ├── config.js            # Firebase connect korar jonno
│   ├── membersService.js    # Member add/list/delete (Firestore + Auth)
│   ├── expensesService.js   # Bazar entry add/list/delete
│   ├── billsService.js      # Bill add/list/update/delete
│   └── noticesService.js    # Notice/complaint add/list/delete
├── context/
│   └── AuthContext.jsx      # Kon user login ache, role ki — eta track kore
├── store/
│   ├── store.js
│   └── slices/               # Redux slices (Firestore service function call kore)
├── components/
│   ├── Sidebar.jsx
│   ├── DashboardLayout.jsx
│   ├── ProtectedRoute.jsx    # Login/role check kore page protect kore
│   ├── Modal.jsx
│   ├── StatCard.jsx          # Animated number card
│   └── EmptyState.jsx
├── pages/
│   ├── Login.jsx
│   ├── NoticeBoard.jsx       # Admin ar Member duijonei use kore
│   ├── admin/                # Admin Dashboard, Members, Expenses, Bills
│   └── member/               # Member Dashboard, Expenses (read-only), Bills
├── App.jsx                   # Shob route + role-based redirect
└── main.jsx

functions/
└── index.js                  # Scheduled Cloud Function — due bill email reminder
```

## Tech Stack

- React 19 + Vite
- Tailwind CSS v3
- React Router v6
- Redux Toolkit (createAsyncThunk diye Firestore-er sathe sync)
- Framer Motion (page transition, animated counter, modal animation)
- Firebase Authentication (Email/Password)
- Firebase Firestore (database)
- Firebase Cloud Functions + Nodemailer (email reminder)
- react-hot-toast (notification)

## Notun Member Add Korar Niyom

Admin login kore "Members" page e jan, "+ Notun Member" button e click korun, naam/email/password din. Eta automatically:
1. Firebase Authentication e notun account banabe
2. Firestore-e member-er profile (role: member) save korbe

Shei email/password diyei shei member login korte parbe.

## Common Problem Shomadhan

- **"Firebase: Error (auth/configuration-not-found)"** — `.env` file thik moto fill up kora hoyni, ba `.env` file-er naam vul.
- **Login korle kichu dekhay na / blank page** — Firestore-e `members` collection-e apnar UID diye document add kora hoyni (Step 4 dekhun).
- **"Missing or insufficient permissions"** — Firestore Rules thik moto publish kora hoyni (Step 3 dekhun).
