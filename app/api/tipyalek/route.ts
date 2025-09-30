import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // ✅ ใช้ env
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "คุณคือเทพองค์ทิพยเลข พูดให้ดูขลัง" },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content || "…";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Tipyalek API Error:", err); // ✅ log ที่ Vercel Logs
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
