// ========================
// FILE: app/actions/chooseDeity.ts
// ========================
import { db } from '@/lib/firebase/firebaseFirestore';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function chooseDeity(deityId: string) {
  const user = getAuth().currentUser;
  if (!user) throw new Error('You must be logged in to choose a deity.');

  const ref = doc(db, 'users', user.uid);
  await setDoc(ref, { chosenDeity: deityId }, { merge: true });
}
