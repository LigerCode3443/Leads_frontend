'use client';

import { deleteLead, updateLead } from '@/lib/api';
import { Lead, LeadStatus } from '@/lib/types';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LeadTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  if (leads.length === 0)
    return <div className="py-10 text-center text-gray-500">No leads found.</div>;

  const onDelete = async (id: string) => {
    setError(null);
    try {
      await deleteLead(id);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Failed to delete the lead.');
    } finally {
    }
  };

  const onToggleStatus = async (id: string, current: LeadStatus) => {
    setError(null);
    setStatusChangingId(id);
    try {
      await updateLead(id, { status: current });
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Failed to update status.');
    } finally {
      setStatusChangingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
      {leads.map((lead) => (
        <div className="p-3 border border-solid border-black rounded-lg" key={lead.id}>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <p className="text-xl">{lead.name}</p>
              <p className="text-sm text-gray-600">{lead.email}</p>
            </div>
            <div className="flex flex-row gap-2">
              <select
                className="border p-1 rounded-lg"
                defaultValue={lead.status}
                onChange={(e) => onToggleStatus(lead.id, e.target.value)}
              >
                {Object.values(LeadStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  router.push(`/leads/${lead.id}`);
                }}
                className="rounded-lg px-3 py-0.5 border border-solid border-black"
              >
                Detail
              </button>

              <button
                onClick={() => {
                  onDelete(lead.id);
                }}
                className="rounded-lg px-3 py-0.5 border border-solid border-black bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
