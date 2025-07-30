import { initializeApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// ✅ Firebase config จาก environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
}

// ✅ Initial Firebase app
const app = initializeApp(firebaseConfig)

// ✅ Auth
const auth = getAuth(app)

// ✅ ให้จำ session แบบไม่หลุดหลังรีเฟรชหรือปิดแท็บ
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('❌ Error setting persistence:', error)
})

// ✅ Firestore และ Storage
const db = getFirestore(app)
const storage = getStorage(app)

// ✅ Export ใช้ทั่วแอพ
export { auth, db, storage }
