"use client";

export default function TipyaLekPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-white p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-purple-700 mb-3">
          เบิกญาณทำนายชะตากับองค์ทิพยเลข
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          ติดต่อผู้ดูแลเพื่อเปิดห้องพิธีกรรมเบิกญาณ  
          ค่าครู 299 บาท / ครั้ง
        </p>

        <img
          src="/images/line-qr.png"
          alt="LINE QR"
          className="w-56 h-56 mx-auto mb-6 rounded-xl border-4 border-green-400 shadow-md"
        />

        <a
          href="https://line.me/ti/p/gKRMcAhruD"
          target="_blank"
          className="bg-green-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          ติดต่อเพื่อเปิดห้องทิพยเลข
        </a>

        <p className="text-xs text-gray-400 mt-6">
          หมายเหตุ: การเบิกญาณนี้เป็นการเข้าถึงคำทำนายเชิงจิตวิญญาณ  
          โปรดใช้วิจารณญาณในการตีความ
        </p>
      </div>
    </div>
  );
}
