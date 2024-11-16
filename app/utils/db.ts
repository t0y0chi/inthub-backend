import { supabase } from '@/app/lib/supabase';
import { EmailMetadata } from '@/app/types/email';
import { createEmbedding } from '@/app/utils/openai';
import { createEmailContent } from '@/app/utils/text';

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

    // バッチ処理用の配列
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < newEmails.length; i += batchSize) {
      const batch = newEmails.slice(i, i + batchSize);
      batches.push(batch);
    }

    let totalSaved = 0;

    // バッチ処理でembeddingを生成し保存
    for (const batch of batches) {
      const emailsWithEmbeddings = await Promise.all(
        batch.map(async (email) => {
          // メールコンテンツを作成（長さを制限）
          const content = createEmailContent(email);
          const embedding = await createEmbedding(content);

          return {
            id: email.id,
            user_id: userId,
            thread_id: email.thread_id,
            subject: email.subject,
            from: email.from,
            date: new Date(email.date).toISOString(),
            body: email.body,
            url: email.url,
            embedding,
          };
        })
      );

      const { error, data } = await supabase
        .from('emails')
        .insert(emailsWithEmbeddings)
        .select('id');

      if (error) throw error;
      totalSaved += data?.length || 0;
    }

    return { count: totalSaved };
  } catch (error) {
    console.error('Error saving emails:', error);
    throw error;
  }
} 
