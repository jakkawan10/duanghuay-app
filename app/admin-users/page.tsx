'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type UserData = {
  selectedGod?: string;
  extraGods?: string[];
  vipLevel?: 'god2' | 'god3' | 'god4' | null;
  vipUntil?: Timestamp;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<{ id: string; data: UserData }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'users'));
      const list: any[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, data: d.data() as UserData });
      });
      setUsers(list);
      setLoading(false);
    };
    load();
  }, []);

  const saveVip = async (
    uid: string,
    vipLevel: 'god2' | 'god3' | 'god4' | null,
    vipDays: number
  ) => {
    const ref = doc(db, 'users', uid);
    const until = Timestamp.fromMillis(Date.now() + vipDays * 24 * 60 * 60 * 1000);

    await updateDoc(ref, {
      vipLevel,
      vipUntil: until,
    });

    toast.success(`อัปเดต VIP ให้ user ${uid} แล้ว`);
  };

  const saveExtraGods = async (uid: string, gods: string[]) => {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { extraGods: gods });
    toast.success(`อัปเดต extraGods ให้ user ${uid} แล้ว`);
  };

  if (loading) return <p className="text-center mt-10">กำลังโหลด...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: จัดการสิทธิ์ผู้ใช้</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u) => (
          <Card key={u.id} className="p-4">
            <CardContent>
              <p className="font-semibold">User: {u.id}</p>
              <p>เทพฟรี: {u.data.selectedGod || '-'}</p>
              <p>
                VIP: {u.data.vipLevel || 'ไม่มี'}{' '}
                {u.data.vipUntil
                  ? `(หมดอายุ: ${u.data.vipUntil.toDate().toLocaleDateString()})`
                  : ''}
              </p>
              <p>extraGods: {u.data.extraGods?.join(', ') || '-'}</p>

              {/* เลือก VIP */}
              <div className="mt-4">
                <Select
                  defaultValue={u.data.vipLevel || ''}
                  onValueChange={(val) =>
                    saveVip(u.id, val as any, 30) // 30 วัน
                  }
                >
                  <SelectItem value="">ไม่มี</SelectItem>
                  <SelectItem value="god2">แพ็กเกจ God2</SelectItem>
                  <SelectItem value="god3">แพ็กเกจ God3</SelectItem>
                  <SelectItem value="god4">แพ็กเกจ God4</SelectItem>
                </Select>
              </div>

              {/* อัปเดต extraGods */}
              <div className="mt-4">
                <Input
                  defaultValue={u.data.extraGods?.join(',') || ''}
                  placeholder="ใส่ชื่อเทพคั่นด้วย , เช่น maneewitch,intra"
                  onBlur={(e) => {
                    const arr = e.target.value
                      .split(',')
                      .map((x) => x.trim())
                      .filter(Boolean);
                    saveExtraGods(u.id, arr);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
