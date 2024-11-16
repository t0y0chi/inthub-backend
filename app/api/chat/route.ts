import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { searchSimilarEmails } from '@/app/utils/search';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.userId) {
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

    // ベクトル検索で関連メールを取得
    const relevantEmails = await searchSimilarEmails(message, token.userId);
    
    // 検索結果を整形して返す
    return NextResponse.json({
      results: relevantEmails.map(email => ({
        subject: email.subject,
        from: email.from,
        date: email.date,
        body: email.body,
        url: email.url,
        similarity: Math.round(email.similarity * 100) + '%', // パーセンテージに変換
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
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
