/**
 * テキストを指定された文字数に制限する
 */
export function truncateText(text: string, maxLength: number = 1000): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * メールコンテンツを作成する
 */
export function createEmailContent(email: {
  subject: string;
  from: string;
  body: string;
}): string {
  const subject = truncateText(email.subject, 200);
  const from = truncateText(email.from, 100);
  const body = truncateText(email.body, 1000);

  return `Subject: ${subject}\n\nFrom: ${from}\n\nBody: ${body}`;
} 
