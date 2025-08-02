import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useUserRole() {
  const { user } = useAuth()
  const [role, setRole] = useState<'free' | 'premium' | 'vip'>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        setRole(data.role || 'free')
      }
      setLoading(false)
    }

    fetchRole()
  }, [user])

  return { role, loading }
}
