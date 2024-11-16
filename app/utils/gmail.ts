import { google } from 'googleapis';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function getGmailClient(req: NextRequest) {
  const token = await getToken({ req });
  
  if (!token?.accessToken) {
    throw new Error('No access token found');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: token.accessToken as string,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function getEmails(gmail: any, query: string = '') {
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 10,
    });

    const messages = response.data.messages || [];
    const emails = await Promise.all(
      messages.map(async (message: any) => {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full',
        });

        const headers = email.data.payload.headers;
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find((h: any) => h.name === 'From')?.value || '';
        const date = headers.find((h: any) => h.name === 'Date')?.value || '';

        let body = '';
        if (email.data.payload.parts) {
          const textPart = email.data.payload.parts.find(
            (part: any) => part.mimeType === 'text/plain'
          );
          if (textPart && textPart.body.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString();
          }
        } else if (email.data.payload.body.data) {
          body = Buffer.from(email.data.payload.body.data, 'base64').toString();
        }

        return {
          id: message.id,
          threadId: message.threadId,
          subject,
          from,
          date,
          body,
          url: `https://mail.google.com/mail/u/0/#inbox/${message.id}`,
        };
      })
    );

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
} 