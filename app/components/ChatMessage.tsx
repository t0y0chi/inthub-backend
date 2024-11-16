type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    subject: string;
    date: string;
    url: string;
  }>;
};

export function ChatMessage({ role, content, sources }: ChatMessageProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg p-4 ${
        role === 'user' 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 dark:bg-gray-800'
      }`}>
        <p className="whitespace-pre-wrap">{content}</p>
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold mb-2">Sources:</p>
            {sources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm hover:underline mb-1"
              >
                {source.subject} ({new Date(source.date).toLocaleDateString()})
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
