'use client';

import { createLead, updateLead } from '@/lib/api';
import { Lead, LeadStatus } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  status: z.nativeEnum(LeadStatus),
  value: z
    .string()
    .refine((val) => !val || !isNaN(Number(val)), 'Value must be a number')
    .transform((val) => (val ? Number(val) : undefined))
    .optional(),
  notes: z.string().optional().or(z.literal('')),
});

type LeadFormData = z.infer<typeof leadSchema>;

type Props = {
  mode: 'create' | 'edit';
  initial?: Lead;
  onSaved?: (lead: Lead) => void;
  onCancel?: () => void;
};

export default function LeadForm({ mode, initial, onSaved, onCancel }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initial?.name ?? '',
      email: initial?.email ?? '',
      company: initial?.company ?? '',
      status: initial?.status ?? LeadStatus.NEW,
      value: initial?.value,
      notes: initial?.notes ?? '',
    },
  });

  const onSubmit: SubmitHandler<LeadFormData> = async (data: LeadFormData) => {
    setError(null);
    try {
      const lead = mode === 'create' ? await createLead(data) : await updateLead(initial!.id, data);

      onSaved?.(lead);
      router.refresh();

      if (mode === 'create') {
        router.push(`/leads/${lead.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-bold">{mode === 'create' ? 'New lead' : 'Edit lead'}</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <label className="text-sm">
          <span className="block font-medium text-gray-700">
            Name <span className="text-red-600">*</span>
          </span>
          <input
            {...register('name')}
            className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </label>

        {/* Email */}
        <label className="text-sm">
          <span className="block font-medium text-gray-700">Email</span>
          <input
            {...register('email')}
            type="email"
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </label>

        {/* Company */}
        <label className="text-sm">
          <span className="block font-medium text-gray-700">Company</span>
          <input
            {...register('company')}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {/* Status */}
        <label className="text-sm">
          <span className="block font-medium text-gray-700">Status</span>
          <select
            {...register('status')}
            className="mt-1 w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(LeadStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {/* Value */}
        <label className="text-sm">
          <span className="block font-medium text-gray-700">Value</span>
          <input
            {...register('value')}
            inputMode="decimal"
            placeholder="e.g. 1500"
            className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.value ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value.message}</p>}
        </label>

        {/* Notes */}
        <label className="text-sm md:col-span-2">
          <span className="block font-medium text-gray-700">Notes</span>
          <textarea
            {...register('notes')}
            rows={4}
            className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
        >
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}
