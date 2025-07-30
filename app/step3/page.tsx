// app/step3/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaRegLightbulb } from "react-icons/fa";
import Image from "next/image";

export default function Step3() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/home");
  };

  return (
    <div className="relative w-screen h-screen">
      <Image
        src="/step3-bg.jpg"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          ดวงดีรับทรัพย์ทุกงวด!
        </h1>
        <p className="text-lg md:text-xl mb-1 drop-shadow-md">
          ตัวเลขขึ้นอยู่กับดวงคุณ
        </p>
        <p className="text-sm md:text-base mb-6 drop-shadow-sm">
          โปรดเช็คดวงของคุณก่อนเข้าสู่ระบบวิเคราะห์เลขเด็ด
        </p>
        <Button
          onClick={handleClick}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full px-6 py-3 flex items-center gap-2 text-lg shadow-xl"
        >
          <FaRegLightbulb className="text-xl" />
          เปิดดวงเลขเด็ด
        </Button>
      </div>
    </div>
  );
}
