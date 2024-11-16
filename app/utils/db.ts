import { supabase } from '@/app/lib/supabase';
import { EmailMetadata } from '@/app/types/email';
import { createEmbedding } from './openai';

export async function saveEmails(emails: EmailMetadata[], userId: string) {
  try {
    // 既存のメールIDを取得
    const { data: existingEmails } = await supabase
      .from('emails')
      .select('id')
      .eq('user_id', userId)
      .in('id', emails.map(email => email.id));

    const existingIds = new Set(existingEmails?.map(email => email.id));

    // 新規メールのみをフィルタリング
    const newEmails = emails.filter(email => !existingIds.has(email.id));

    if (newEmails.length === 0) {
      return { count: 0 };
    }

    // 各メールのembeddingを生成
    const emailsWithEmbeddings = await Promise.all(
      newEmails.map(async (email) => {
        const content = `Subject: ${email.subject}\n\nFrom: ${email.from}\n\nBody: ${email.body}`;
        const embedding = await createEmbedding(content);
        return {
          ...email,
          user_id: userId,
          embedding,
        };
      })
    );

    // バッチ保存
    const { error, count } = await supabase
      .from('emails')
      .insert(emailsWithEmbeddings)
      .select('count');

    if (error) throw error;

    return { count: count || 0 };
  } catch (error) {
    console.error('Error saving emails:', error);
    throw error;
  }
} 
