// lib/firebase/updateUserPlan.ts
import { db } from './firebase'
import { doc, updateDoc } from 'firebase/firestore'

export async function updateUserPlan(uid: string, plan: 'free' | 'premium' | 'vip') {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    plan,
    updatedAt: new Date(),
  })
}
