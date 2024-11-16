import { supabase } from '@/app/lib/supabase';
import { createEmbedding } from './openai';
import { EmailData } from '@/app/types/email';
import { truncateText } from './text';

type SearchResult = EmailData & {
  similarity: number;
  url: string;
};

export async function searchSimilarEmails(
  query: string,
  userId: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const embedding = await createEmbedding(query);

    const { data: emails, error } = await supabase
      .rpc('match_emails', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit,
        p_user_id: userId
      });

    if (error) throw error;

    const processedEmails = emails.map(email => ({
      ...email,
      body: truncateText(email.body, 1000),
      url: email.url || `https://mail.google.com/mail/u/0/#inbox/${email.id}`,
    }));

    return processedEmails.sort((a, b) => b.similarity - a.similarity);
  } catch (error) {
    console.error('Error searching emails:', error);
    throw error;
  }
} 
