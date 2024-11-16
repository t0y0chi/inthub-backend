import { supabase } from '@/app/lib/supabase';
import { createEmbedding } from './openai';
import { EmailData } from '@/app/types/email';

export async function searchSimilarEmails(
  query: string,
  userId: string,
  limit: number = 5
): Promise<Omit<EmailData, 'embedding'>[]> {
  try {
    const embedding = await createEmbedding(query);

    const { data: emails, error } = await supabase
      .rpc('match_emails', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: limit,
        p_user_id: userId
      });

    if (error) throw error;

    return emails;
  } catch (error) {
    console.error('Error searching emails:', error);
    throw error;
  }
} 
