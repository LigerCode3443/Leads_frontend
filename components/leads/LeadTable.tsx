'use client';

import { deleteLead, getComments, updateLead } from '@/lib/api';
import { Comment, Lead, LeadStatus } from '@/lib/types';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LeadTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusChangingId, setStatusChangingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commentsLoadingForId, setCommentsLoadingForId] = useState<string | null>(null);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [commentsCache, setCommentsCache] = useState<Record<string, Comment[]>>({});

  if (leads.length === 0)
    return <div className="py-10 text-center text-gray-500">No leads found.</div>;

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this lead? This action cannot be undone.');
    if (!ok) return;

    setError(null);
    setDeletingId(id);
    try {
      await deleteLead(id);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Failed to delete the lead.');
    } finally {
      setDeletingId(null);
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

  const ensureComments = async (leadId: string) => {
    setCommentsError(null);
    if (commentsCache[leadId]) return;

    setCommentsLoadingForId(leadId);
    try {
      const list = await getComments(leadId);
      setCommentsCache((prev) => ({ ...prev, [leadId]: list }));
    } catch (err) {
      if (err instanceof ApiError) setCommentsError(err.message);
      else setCommentsError('Failed to load comments.');
    } finally {
      setCommentsLoadingForId(null);
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
        <div className="p-3 border border-solid border-black rounded-lg">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <p className="text-xl">{lead.name}</p>
              <p className="text-sm text-gray-600">{lead.email}</p>
            </div>
            <div>
              <button className="rounded-lg px-[10px] py-[5px] border border-solid border-blue-800">Detail</button>
              <select
                className="border p-1 rounded"
                defaultValue={lead.status}
                onChange={(e) => onToggleStatus(lead.id, e.target.value)}
              >
                {Object.values(LeadStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                alignItems: { sm: 'center' },
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography component="div" noWrap sx={{ fontWeight: 700 }}>
                  {lead.name}
                </Typography>
                <Typography component="div" variant="body2" color="text.secondary" noWrap>
                  {lead.email || '—'} · {lead.company || '—'}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Link
                  href={`/leads/${lead.id}`}
                  className="inline-flex"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Button size="small" variant="text">
                    Details
                  </Button>
                </Link>

                <select
                  className="border p-2 rounded"
                  defaultValue={lead.status}
                  onChange={(e) => onToggleStatus(lead.id, lead.status)}
                >
                  {Object.values(LeadStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <Button
                  size="small"
                  color="error"
                  variant="text"
                  disabled={deletingId === lead.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(lead.id);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {deletingId === lead.id ? 'Deleting…' : 'Delete'}
                </Button>
              </Box>
            </Box> */}
        </div>
      ))}
    </div>
  );
}
