'use client';

import { useEffect } from 'react';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm text-center max-w-md w-full">
        <h2 className="text-lg font-bold text-[#1c2024] mb-2">Something went wrong</h2>
        <p className="text-sm text-[#717682] mb-6">
          An unexpected error occurred. Please try again or refresh the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-[#1c2024] text-white text-sm font-medium hover:bg-[#2b3238] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
