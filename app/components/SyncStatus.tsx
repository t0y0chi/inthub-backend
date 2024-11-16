'use client';

import { useState } from 'react';

export function SyncStatus() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch('/api/sync');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync emails');
      }

      setLastSync(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="px-4 py-2 text-sm rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
      >
        {isSyncing ? 'Syncing...' : 'Sync Emails'}
      </button>
      {lastSync && (
        <span className="text-sm text-gray-500">
          Last synced: {lastSync.toLocaleTimeString()}
        </span>
      )}
      {error && (
        <span className="text-sm text-red-500">
          Error: {error}
        </span>
      )}
    </div>
  );
} 
