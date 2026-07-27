import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, tone, target_lang } = body;

    const apiKey = process.env.DIFY_API_KEY;
    const baseUrl = process.env.DIFY_API_BASE_URL || 'https://api.dify.ai/v1';

    if (!apiKey) {
      return NextResponse.json({ error: 'Dify API Key 未設定' }, { status: 500 });
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
          target_lang: target_lang ?? 'en-US',
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

    return NextResponse.json(parsedResult);

  } catch (error) {
    return NextResponse.json({ error: 'Server Error', details: error.message }, { status: 500 });
  }
}
