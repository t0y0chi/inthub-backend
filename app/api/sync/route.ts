import { NextResponse } from 'next/server';
import { getGmailClient, getEmails } from '@/app/utils/gmail';
import { saveEmails } from '@/app/utils/db';
import { getToken } from 'next-auth/jwt';

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json();
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const token = await getToken({ req: req as any });
    if (!token?.sub) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const gmail = await getGmailClient(req as any);
    
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
    
    const query = `after:${startTimestamp} before:${endTimestamp}`;
    const emails = await getEmails(gmail, query);

    // Save emails to Supabase
    const { count } = await saveEmails(emails, token.sub);

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Sync error:', error);
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
