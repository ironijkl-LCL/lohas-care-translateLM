import { NextResponse } from 'next/server';

// 1. 處理瀏覽器的 OPTIONS 預檢請求 (Preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// 2. 處理實際的 POST 翻譯請求
export async function POST(request) {
  // CORS 跨域回應標頭
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await request.json();
    const { query, tone, target_lang } = body;

    const apiKey = process.env.DIFY_API_KEY;
    const baseUrl = process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1';

    if (!apiKey) {
      return NextResponse.json({ error: 'Dify API Key 未設定' }, { status: 500, headers: corsHeaders });
    }

    const response = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          tone: String(tone ?? '0'),
          target_lang: targetLang ?? 'en-US',
        },
        query: query,
        response_mode: 'blocking',
        user: 'lingo-prime-user',
      }),
    });

    const data = await response.json();
    
    let parsedResult;
    if (typeof data.answer === 'string') {
      try {
        parsedResult = JSON.parse(data.answer);
      } catch {
        parsedResult = { translation: data.answer, insight: '無解構資訊' };
      }
    } else {
      parsedResult = data.answer || data;
    }

    return NextResponse.json(parsedResult, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({ error: 'Server Error', details: error.message }, { status: 500, headers: corsHeaders });
  }
}
