'use client';

import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/leads" className="text-sm text-blue-600 hover:underline">
          ← Back to leads
        </Link>
      </div>

      <div className="rounded border border-red-200 bg-red-50 p-4">
        <h2 className="font-bold text-red-800">Error</h2>
        <p className="mt-1 text-sm text-red-700">{error.message || 'Something went wrong.'}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-3 px-3 py-2 rounded bg-white border hover:bg-gray-50 text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

