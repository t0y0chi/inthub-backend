type SearchResult = {
  subject: string;
  from: string;
  date: string;
  body: string;
  url: string;
  similarity: string;
};

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
  results?: SearchResult[];
};

export function ChatMessage({ role, content, results }: ChatMessageProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg p-4 ${
        role === 'user' 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 dark:bg-gray-800'
      }`}>
        <p className="whitespace-pre-wrap">{content}</p>
        {results && results.length > 0 && (
          <div className="mt-4 space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                <div className="flex justify-between items-start mb-2">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-medium hover:underline group"
                  >
                    <span>{result.subject}</span>
                    <svg 
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                      />
                    </svg>
                  </a>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {result.similarity}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  From: {result.from}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(result.date).toLocaleString()}
                </div>
                <p className="text-sm whitespace-pre-line">{result.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
