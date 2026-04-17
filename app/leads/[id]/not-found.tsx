import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/leads" className="text-sm text-blue-600 hover:underline">
          ← Back to leads
        </Link>
      </div>
      <div className="rounded border bg-white p-6 text-center">
        <h2 className="text-xl font-bold">Lead not found</h2>
        <p className="mt-2 text-sm text-gray-600">It may have been deleted, or the URL is incorrect.</p>
      </div>
    </div>
  );
}

