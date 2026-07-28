const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// 從 Render 環境變數中讀取 Dify 設定
const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_API_URL = process.env.DIFY_API_URL || 'https://api.dify.ai/v1/chat-messages';

// 啟用 CORS 允許前端跨域請求
app.use(cors());
app.use(express.json());

// 健康檢查路由（測試 Render 服務是否正常）
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'LingoPrime Proxy Service Running' });
});

// 翻譯代理 API 端點
app.post('/api/translate', async (req, res) => {
  try {
    const { query, tone, target_lang } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // 呼叫 Dify API
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          query: query,
          tone: String(tone || '0'),
          target_lang: targetLang || 'en-US'
        },
        query: query,
        response_mode: 'blocking',
        user: 'lingo-prime-user'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Dify API Error', details: errorText });
    }

    const data = await response.json();
    return res.json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Proxy Server Error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
