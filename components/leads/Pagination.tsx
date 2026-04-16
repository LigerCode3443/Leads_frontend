'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
  total: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Pagination({ total }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const page = Math.max(1, Number(sp.get('page') || '1') || 1);
  const limit = Math.max(1, Number(sp.get('limit') || '10') || 10);
  const pageCount = Math.max(1, Math.ceil(total / limit));

  const go = (nextPage: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set('page', String(clamp(nextPage, 1, pageCount)));
    router.push(`${pathname}?${params.toString()}`);
  };

  const setLimit = (nextLimit: number) => {
    const params = new URLSearchParams(sp.toString());
    params.set('limit', String(nextLimit));
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        Page <span className="font-semibold text-gray-900">{page}</span> of{' '}
        <span className="font-semibold text-gray-900">{pageCount}</span> (total {total})
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-2">
          <span className="text-sm text-gray-600">Limit</span>
          <select
            className="border rounded px-2 py-2 bg-white text-sm"
            value={String(limit)}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page <= 1 || pageCount <= 1}
          className="px-3 py-2 rounded border bg-white text-sm disabled:text-gray-400 disabled:bg-gray-50"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page >= pageCount || pageCount <= 1}
          className="px-3 py-2 rounded border bg-white text-sm disabled:text-gray-400 disabled:bg-gray-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

