'use client';

import { useState } from 'react';
import CommentSection from '@/components/leads/CommentSection';
import { Comment } from '@/lib/types';

export default function LeadComments({
  leadId,
  comments,
  onNewComments,
}: {
  leadId: string;
  comments: Comment[];
  onNewComments: (com: Coment) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold">Comments</h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-sm px-3 py-2 rounded border bg-white hover:bg-gray-50"
          aria-expanded={open}
          aria-controls="comment-composer"
        >
          {open ? 'Close' : 'Add comment'}
        </button>
      </div>

      <div
        id="comment-composer"
        className={`mt-3 overflow-hidden rounded-lg border bg-white transition-all ${
          open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 border-transparent'
        }`}
      >
        <div className={open ? 'p-4' : 'p-0'}>
          <CommentSection
            leadId={leadId}
            comments={comments}
            composerOnly
            onNewComments={onNewComments}
          />
        </div>
      </div>

      <div className="mt-4">
        <CommentSection
          leadId={leadId}
          comments={comments}
          listOnly
          onNewComments={onNewComments}
        />
      </div>
    </div>
  );
}
