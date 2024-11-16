import { NextResponse } from 'next/server';
import { getGmailClient, getEmails } from '@/app/utils/gmail';

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json();
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const gmail = await getGmailClient(req as any);
    
    // Convert dates to Unix timestamp (seconds)
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
    
    const query = `after:${startTimestamp} before:${endTimestamp}`;
    const emails = await getEmails(gmail, query);

    // TODO: ここでSupabaseにメールデータを保存する処理を追加

    return NextResponse.json({
      success: true,
      count: emails.length,
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 
