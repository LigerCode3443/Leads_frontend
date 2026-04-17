'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteLead } from '@/lib/api';
import { Lead } from '@/lib/types';
import LeadForm from '@/components/leads/LeadForm';
import { ApiError } from 'next/dist/server/api-utils';

export default function LeadDetailsClient({ initialLead }: { initialLead: Lead }) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead>(initialLead);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    const ok = window.confirm('Delete this lead? This action cannot be undone.');
    if (!ok) return;

    setError(null);
    setDeleting(true);
    try {
      await deleteLead(lead.id);
      router.push('/leads');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Failed to delete the lead.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border p-6">
      <Link href="/leads" className="text-lg text-gray-600 hover:text-blue-700">
        Back to list
      </Link>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{lead.name}</h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Email:</span> {lead.email || '—'}
            </div>
            <div>
              <span className="text-gray-500">Company:</span> {lead.company || '—'}
            </div>
            <div>
              <span className="text-gray-500">Status:</span> {lead.status}
            </div>
            <div>
              <span className="text-gray-500">Value:</span> ${lead.value || 0}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Notes:</p>
            <p className="mt-1 whitespace-pre-wrap">{lead.notes || 'No notes'}</p>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            createdAt: {new Date(lead.createdAt).toLocaleString()} · updatedAt:{' '}
            {new Date(lead.updatedAt).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="text-sm px-3 py-1 rounded border bg-white hover:bg-gray-50"
          >
            {editing ? 'Close' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="text-sm px-3 py-2 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      {editing && (
        <div className="mt-6">
          <LeadForm
            mode="edit"
            initial={lead}
            onSaved={(updated) => {
              setLead(updated);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
