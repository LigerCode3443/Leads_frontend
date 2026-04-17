'use client';

import { useState } from 'react';
import { Comment } from '@/lib/types';
import { addComment } from '@/lib/api';
import { ApiError } from 'next/dist/server/api-utils';

export default function CommentSection({
  leadId,
  comments,
  composerOnly,
  listOnly,
  onNewComments,
}: {
  leadId: string;
  comments: Comment[];
  composerOnly?: boolean;
  listOnly?: boolean;
  onNewComments?: (comment: Comment) => void;
}) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const newComment = await addComment(leadId, { text: text.trim() });

      onNewComments?.(newComment);
      setText('');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Failed to add comment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={composerOnly ? '' : 'border-t pt-6'}>
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      {!listOnly && (
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={loading}
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting…' : 'Add comment'}
            </button>
          </div>
        </form>
      )}

      {!composerOnly && (
        <div className="space-y-4">
          {comments.length === 0 && (
            <div className="py-6 text-sm text-gray-500">No comments yet.</div>
          )}
          {comments.map((c) => (
            <div key={c.id} className="bg-gray-50 p-4 rounded border">
              <p className="text-gray-800">{c.text}</p>
              <span className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
