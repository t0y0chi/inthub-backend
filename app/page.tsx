'use client';

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

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
        {status === 'loading' ? (
          <div className="px-4 py-2 text-sm">Loading...</div>
        ) : session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{session.user?.email}</span>
            <button 
              onClick={() => signOut()}
              className="px-4 py-2 text-sm rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signIn('google')}
            className="px-4 py-2 text-sm rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Sign in with Google
          </button>
        )}
      </header>

      {/* Main Chat Area */}
      <main className="flex flex-col gap-4 p-4 overflow-auto">
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
      </main>

      {/* Chat Input */}
      <footer className="p-4 border-t">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Ask about your emails..."
              className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              disabled={!session}
            />
            <button 
              className="px-4 py-2 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!session}
            >
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
