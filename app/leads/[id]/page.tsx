'use client'; // 1. Додаємо директиву клієнта

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import LeadDetailsClient from '@/components/leads/LeadDetailsClient';
import LeadComments from '@/components/leads/LeadComments';
import { getComments, getLead } from '@/lib/api';
import { Lead, LeadComment } from '../../../lib/types';

export default function LeadDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [comments, setComments] = useState<LeadComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [leadData, commentsData] = await Promise.all([
          getLead(id),
          getComments(id).catch(() => []),
        ]);

        if (!leadData) {
          setError(true);
        } else {
          setLead(leadData);
          setComments(commentsData);
        }
      } catch (err: unknown) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  const onNewComments = async (newComment: LeadComment) => {
    try {
      setComments((prev) => [newComment, ...prev]);
      console.log(comments);
    } catch (err: unknown) {
      console.log(err);
    }
  };
  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error || !lead) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <LeadDetailsClient initialLead={lead} />
      <LeadComments leadId={lead.id} comments={comments} onNewComments={onNewComments} />
    </div>
  );
}
