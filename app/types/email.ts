export type EmailData = {
  id: string;
  user_id: string;
  thread_id: string;
  subject: string;
  from: string;
  date: string;
  body: string;
  url: string;
  embedding: number[] | null;
  created_at: string;
};

export type EmailMetadata = Omit<EmailData, 'embedding' | 'created_at'>; 
