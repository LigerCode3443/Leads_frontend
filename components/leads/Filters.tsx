// src/components/leads/Filters.tsx
'use client';

import { LeadStatus } from '@/lib/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get('q') || '';
  const [q, setQ] = useState(currentQ);

  useEffect(() => {
    setQ(currentQ);
  }, [currentQ]);

  const paramsObj = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const updateParams = (updates: Record<string, string | null>, resetPage = true) => {
    const params = new URLSearchParams(paramsObj.toString());
    for (const [name, value] of Object.entries(updates)) {
      if (value == null || value === '') params.delete(name);
      else params.set(name, value);
    }
    if (resetPage) params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      updateParams({ q }, true);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
      <input
        type="text"
        placeholder="Search (name, email, company...)"
        className="border p-2 rounded md:w-64"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <select
        className="border p-2 rounded"
        defaultValue={searchParams.get('status') || ''}
        onChange={(e) => updateParams({ status: e.target.value }, true)}
      >
        <option value="">All statuses</option>
        {Object.values(LeadStatus).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select
        className="border p-2 rounded"
        defaultValue={searchParams.get('sort') || 'createdAt'}
        onChange={(e) => updateParams({ sort: e.target.value }, true)}
      >
        <option value="createdAt">createdAt</option>
        <option value="updatedAt">updatedAt</option>
      </select>

      <select
        className="border p-2 rounded"
        defaultValue={searchParams.get('order') || 'desc'}
        onChange={(e) => updateParams({ order: e.target.value }, true)}
      >
        <option value="desc">desc</option>
        <option value="asc">asc</option>
      </select>
    </div>
  );
}
