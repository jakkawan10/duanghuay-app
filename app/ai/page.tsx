import VIPOnlyRoute from "@/components/VIPOnlyRoute"

export default function AIPage() {
  return (
    <VIPOnlyRoute>
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">เลขเด็ด AI สำหรับ VIP เท่านั้น</h1>
        {/* 🔮 ใส่เนื้อหาหลักของการวิเคราะห์เลขเด็ดไว้ตรงนี้ */}
      </div>
    </VIPOnlyRoute>
  )
}
