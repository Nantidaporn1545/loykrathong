import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// AI Wish Polisher API Route using @google/genai
app.post('/api/ai-wish', async (req, res) => {
  const { wish, nickname, department } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Return friendly Thai fallback wish
    return res.json({
      polishedWish: `ขออำนาจคุณพระศรีรัตนตรัยและพระแม่คงคา ดลบันดาลให้คุณ${nickname || 'พนักงาน'} (${department || 'V45'}) ประสบความสุข ความเจริญ สุขภาพแข็งแรง ไร้โรคภัย และก้าวหน้าในหน้าที่การงาน V45 ยิ่งๆ ขึ้นไป`,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `คุณคือผู้ช่วยเกลาคำอธิษฐานวันลอยกระทงสำหรับพนักงานองค์กร V45
ข้อความต้นฉบับของผู้ใช้: "${wish || 'ขอให้มีความสุขสำเร็จ'}"
ชื่อผู้ขอ: "${nickname || 'พนักงาน'}"
แผนก: "${department || 'V45'}"

คำสั่ง:
1. เขียนคำอธิษฐานวันลอยกระทงภาษาไทยที่ไพเราะ อบอุ่น เป็นสิริมงคล และเสริมสร้างกำลังใจให้แก่พนักงาน
2. ความยาวประมาณ 1-2 ประโยค (ไม่เกิน 250 ตัวอักษร)
3. ไม่ต้องมีเครื่องหมายคำพูด ตอบเฉพาะข้อความคำอธิษฐานภาษาไทยล้วนๆ`,
    });

    const polishedWish = response.text ? response.text.trim().replace(/^"|"$/g, '') : wish;
    res.json({ polishedWish });
  } catch (error) {
    console.error('Error generating AI wish:', error);
    res.json({
      polishedWish: `ขออำนาจคุณพระศรีรัตนตรัยและพระแม่คงคา ดลบันดาลให้คุณ${nickname || 'พนักงาน'} ประสบความสุข ความเจริญ สุขภาพแข็งแรง ปราศจากโรคภัย และประสบความสำเร็จในองค์กร V45`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, () => {
    console.log(`V45 Loy Krathong Server running at http://localhost:${PORT}`);
  });
}

startServer();
