import "dotenv/config"; // โหลด .env.local อัตโนมัติ
import { readFileSync } from "fs";
import path from "path";
import { adminDb } from "../../lib/firebaseAdmin";

type Row = { date: string; last3: string | number; bottom2: string | number };

async function importLottery() {
  const filePath = path.join(process.cwd(), "app/data/lottery-history.json");
  const raw = readFileSync(filePath, "utf-8");
  const rows: Row[] = JSON.parse(raw);

  for (const { date, last3, bottom2 } of rows) {
    // ใช้ date เป็น docId เลยก็ได้ หรือจะแปลงเป็น 2025_09_16 ก็ได้
    const docId = date;

    await adminDb.collection("lottery_history").doc(docId).set(
      {
        date,
        last3: String(last3),
        bottom2: String(bottom2),
      },
      { merge: true }
    );

    console.log(`✅ Imported ${date}`);
  }
}

importLottery()
  .then(() => {
    console.log("🎉 Import completed!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Import failed:", e);
    process.exit(1);
  });
