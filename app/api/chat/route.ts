import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { searchSimilarEmails } from '@/app/utils/search';
import { createChatCompletion } from '@/app/utils/openai';

export async function POST(req: Request) {
  try {
    const token = await getToken({ req: req as any });
    if (!token?.sub) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // 関連メールを検索
    const relevantEmails = await searchSimilarEmails(message, token.sub);
    
    // コンテキストを作成
    const context = relevantEmails.map(email => `
Email from: ${email.from}
Subject: ${email.subject}
Date: ${email.date}
Content: ${email.body}
---
    `).join('\n');

    // ChatGPTで回答を生成
    const response = await createChatCompletion([
      { role: 'user', content: message }
    ], context);

    return NextResponse.json({
      message: response,
      sources: relevantEmails.map(email => ({
        subject: email.subject,
        date: email.date,
        url: email.url,
      })),
    });
  } catch (error) {
    console.error('Chat error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 
