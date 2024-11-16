'use client';

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { SyncStatus } from './components/SyncStatus';
import Link from 'next/link';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    subject: string;
    date: string;
    url: string;
  }>;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // TODO: APIエンドポイントの実装
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        sources: data.sources,
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[60px_1fr_auto] min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 border-b">
        <div className="flex items-center gap-2">
          <Image
            src="https://nextjs.org/icons/next.svg"
            alt="Logo"
            width={24}
            height={24}
            className="dark:invert"
          />
          <h1 className="font-semibold">Gmail Chat</h1>
        </div>
        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="px-4 py-2 text-sm">Loading...</div>
          ) : session ? (
            <>
              <Link
                href="/settings"
                className="px-4 py-2 text-sm rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Settings
              </Link>
              <span className="text-sm">{session.user?.email}</span>
              <button 
                onClick={() => signOut()}
                className="px-4 py-2 text-sm rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <button 
              onClick={() => signIn('google')}
              className="px-4 py-2 text-sm rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex flex-col gap-4 p-4 overflow-auto">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center p-8 text-gray-500">
            <div>
              {!session ? (
                <>
                  <p className="mb-4">Sign in with your Google account to start chatting about your emails</p>
                  <p className="text-sm">Your emails will be processed securely and privately</p>
                </>
              ) : (
                <p>Start asking questions about your emails!</p>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl w-full mx-auto">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Chat Input */}
      <footer className="p-4 border-t">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your emails..."
              className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              disabled={!session || isLoading}
            />
            <button 
              type="submit"
              className="px-4 py-2 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!session || isLoading || !input.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
