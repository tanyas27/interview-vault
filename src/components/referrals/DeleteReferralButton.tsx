'use client';

import { Trash2 } from 'lucide-react';

export function DeleteReferralButton({ deleteAction }: { deleteAction: () => Promise<void> }) {
  return (
    <form action={deleteAction} className="flex justify-end pt-2">
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
        onClick={(e) => {
          if (!confirm('Delete this referral?')) e.preventDefault();
        }}
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete referral
      </button>
    </form>
  );
}
