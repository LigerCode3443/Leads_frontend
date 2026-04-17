import Link from 'next/link';
import LeadForm from '@/components/leads/LeadForm';

export default function NewLeadPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/leads" className="text-sm text-blue-600 hover:underline">
          ← Back to leads
        </Link>
      </div>
      <LeadForm mode="create" />
    </div>
  );
}

