'use client';
import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('我想食壽司');
  const [translation, setTranslation] = useState('Craving some sushi right now, got any spots?');
  const [insight, setInsight] = useState('用 "Craving..." 比 I want 更道地！');
  const [status, setStatus] = useState('分析完成');

  async function handleTranslate() {
    setStatus('⚡ AI 思考中...');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputText, tone: '0', target_lang: 'en-US' }),
      });
      const data = await res.json();
      if (data.translation) setTranslation(data.translation);
      if (data.insight) setInsight(data.insight);
      setStatus('分析完成');
    } catch (err) {
      setStatus('❌ 傳輸錯誤');
    }
  }

  return (
    <main style={{ padding: 20, color: '#fff', background: '#080B11', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h2>⚡ LINGO//PRIME (Next.js 安全轉接版)</h2>
      <p style={{ color: '#00F2FE' }}>狀態：{status}</p>
      
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 16, margin: '20px 0' }}>
        <p style={{ color: '#94A3B8' }}>「 {inputText} 」</p>
        <h1 style={{ fontSize: 24, margin: '10px 0' }}>"{translation}"</h1>
        <p style={{ background: 'rgba(112,0,255,0.2)', padding: 10, borderRadius: 8 }}>💡 {insight}</p>
      </div>

      <button 
        onClick={handleTranslate}
        style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #00F2FE, #7000FF)', border: 'none', color: '#fff', borderRadius: 20, cursor: 'pointer', fontWeight: 'bold' }}>
        測試呼叫 Dify API
      </button>
    </main>
  );
}
