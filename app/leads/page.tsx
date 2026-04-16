'use client'; // Обов'язково додаємо для useEffect та useState

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Filters from '@/components/leads/Filters';
import LeadTable from '@/components/leads/LeadTable';
import Pagination from '@/components/leads/Pagination';
import { GetLeadsParams, LeadStatus, PaginatedLeads } from '@/lib/types';
import { ApiErrorResponse, getLeads } from '@/lib/api';

export default function LeadsPage() {
  const searchParams = useSearchParams();

  const [data, setData] = useState<PaginatedLeads>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params: GetLeadsParams = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 10,
      status: (searchParams.get('status') as LeadStatus) || undefined,
      q: searchParams.get('q') || undefined,
      sort: (searchParams.get('sort') as any) || 'createdAt',
      order: (searchParams.get('order') as any) || 'desc',
    };

    try {
      const result = await getLeads(params);
      setData(result);
    } catch (err: any) {
      const apiErr = err as ApiErrorResponse;
      setError(apiErr.message || 'Failed to load leads.');
      setData({ items: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="max-w-6xl mx-auto p-6 h-dvh">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Search, filters, sorting, and pagination.</p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New lead
        </Link>
      </div>

      <Filters />

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div
        className={`flex flex-col min-h-auto mt-4  transition-opacity justify-between ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
      >
        <LeadTable leads={data.items} />
        <Pagination total={data.total} />
      </div>

      {isLoading && <div className="text-center mt-4 text-gray-500 text-sm">Loading leads...</div>}
    </div>
  );
}
