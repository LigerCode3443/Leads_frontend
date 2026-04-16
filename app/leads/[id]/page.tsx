import { notFound } from 'next/navigation';
import LeadDetailsClient from '@/components/leads/LeadDetailsClient';
import LeadComments from '@/components/leads/LeadComments';
import { getComments, getLead } from '@/lib/api';
import { ApiError } from 'next/dist/server/api-utils';

export default async function LeadDetailsPage({ params }: { params: { id: string } }) {
  let lead: Awaited<ReturnType<typeof getLead>>;
  let comments: Awaited<ReturnType<typeof getComments>>;

  try {
    lead = await getLead(params.id);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return notFound();
    throw err;
  }

  try {
    comments = await getComments(params.id);
  } catch {
    comments = [];
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <LeadDetailsClient initialLead={lead} />
      <LeadComments leadId={lead.id} initialComments={comments} />
    </div>
  );
}