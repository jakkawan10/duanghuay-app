export async function getPrediction(message: string): Promise<string> {
  // Mock การตอบ GPT
  const replies = [
    'การงานของคุณกำลังไปในทางที่ดีขึ้น\nอย่าท้อถอย',
    'ความรักยังไม่แน่นอน แต่มีแสงสว่างรออยู่',
    'วันนี้ควรระวังคำพูด เพราะอาจนำพาปัญหา',
    'คุณมีเกณฑ์จะได้รับข่าวดีเรื่องเงิน',
    'จงเชื่อในสัญชาตญาณของตัวเอง แล้วจะไม่ผิดหวัง'
  ];
  const random = replies[Math.floor(Math.random() * replies.length)];
  return `🔮 คำทำนาย:\n${random}`;
}
