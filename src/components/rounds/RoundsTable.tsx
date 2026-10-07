'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import { Calendar, ChevronRight, ChevronDown, CheckCircle2, XCircle, Clock, Search, Building2, HelpCircle, Filter, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface RoundItem {
  id: string;
  roundType: string;
  roundNumber: number;
  scheduledDate: Date | string | null;
  status: string;
  application: {
    id: string;
    companyName: string;
    jobTitle: string;
  };
  roundQuestions?: Array<{
    id?: string;
    question?: {
      questionText?: string;
      category?: string;
    };
  }>;
}

interface RoundsTableProps {
  initialRounds: RoundItem[];
}

export function RoundsTable({ initialRounds }: RoundsTableProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);

  // Extract unique companies with their counts
  const companyCounts = useMemo(() => {
    const map = new Map<string, number>();
    initialRounds.forEach((r) => {
      const comp = r.application.companyName.trim();
      map.set(comp, (map.get(comp) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [initialRounds]);

  // Filtered rounds list
  const filteredRounds = useMemo(() => {
    return initialRounds.filter((round) => {
      const matchCompany =
        selectedCompany === 'ALL' ||
        round.application.companyName.toLowerCase() === selectedCompany.toLowerCase();

      const matchStatus =
        selectedStatus === 'ALL' || round.status === selectedStatus;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        round.application.companyName.toLowerCase().includes(q) ||
        round.application.jobTitle.toLowerCase().includes(q) ||
        round.roundType.toLowerCase().replace(/_/g, ' ').includes(q) ||
        round.roundQuestions?.some((rq) =>
          rq.question?.questionText?.toLowerCase().includes(q)
        );

      return matchCompany && matchStatus && matchSearch;
    });
  }, [initialRounds, selectedCompany, selectedStatus, searchQuery]);

  return (
    <div className="space-y-4">
      {/* 1. Filter Toolbar */}
      <div className="relative z-10 p-4 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] space-y-3 min-w-0">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0">
            {/* Search bar */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8e939f]" />
              <Input
                type="text"
                placeholder="Search rounds, questions, roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-full bg-[#fcfbf7] border-black/10 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Radix Portal Company Dropdown */}
            <DropdownMenu.Root open={isCompanyOpen} onOpenChange={setIsCompanyOpen}>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={cn(
                    "h-9 px-3.5 rounded-full bg-[#fcfbf7] hover:bg-white border flex items-center gap-2 text-xs font-semibold text-[#1c2024] shadow-2xs transition-all cursor-pointer focus:outline-none shrink-0",
                    isCompanyOpen
                      ? "border-[#ffcf36] ring-2 ring-[#ffcf36]/30 bg-white"
                      : "border-black/10 hover:border-black/20"
                  )}
                >
                  <Building2 className="w-3.5 h-3.5 text-[#ffcf36] shrink-0" />
                  <span className="truncate max-w-[130px]">
                    {selectedCompany === 'ALL' ? 'All Companies' : selectedCompany}
                  </span>
                  <span className="text-[10px] text-[#717682] font-semibold px-1.5 py-0.5 rounded-full bg-black/5">
                    {selectedCompany === 'ALL'
                      ? initialRounds.length
                      : companyCounts.find(([c]) => c.toLowerCase() === selectedCompany.toLowerCase())?.[1] || 0}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                      isCompanyOpen ? 'rotate-180 text-[#1c2024]' : ''
                    }`}
                  />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="start"
                  sideOffset={6}
                  className="z-[100] min-w-[220px] max-w-xs rounded-2xl bg-white border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.08)] p-1.5 focus:outline-none"
                >
                  <div className="max-h-64 overflow-y-auto space-y-0.5 pr-0.5 overscroll-contain">
                    <DropdownMenu.Item
                      onSelect={() => setSelectedCompany('ALL')}
                      className={cn(
                        "flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer outline-none select-none",
                        selectedCompany === 'ALL'
                          ? "bg-[#1c2024] text-white font-semibold data-[highlighted]:bg-[#1c2024]"
                          : "text-[#1c2024] data-[highlighted]:bg-black/5 hover:bg-black/5 font-medium"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                          {selectedCompany === 'ALL' && <Check className="w-3.5 h-3.5 text-[#ffcf36] stroke-[2.5]" />}
                        </span>
                        <span className="truncate">All Companies</span>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full shrink-0",
                          selectedCompany === 'ALL' ? "bg-white/20 text-white font-semibold" : "bg-black/5 text-[#717682]"
                        )}
                      >
                        {initialRounds.length}
                      </span>
                    </DropdownMenu.Item>

                    {companyCounts.map(([company, count]) => {
                      const isSelected = selectedCompany.toLowerCase() === company.toLowerCase();
                      return (
                        <DropdownMenu.Item
                          key={company}
                          onSelect={() => setSelectedCompany(company)}
                          className={cn(
                            "flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer outline-none select-none",
                            isSelected
                              ? "bg-[#1c2024] text-white font-semibold data-[highlighted]:bg-[#1c2024]"
                              : "text-[#1c2024] data-[highlighted]:bg-black/5 hover:bg-black/5 font-medium"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#ffcf36] stroke-[2.5]" />}
                            </span>
                            <span className="truncate">{company}</span>
                          </div>
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-full shrink-0",
                              isSelected ? "bg-white/20 text-white font-semibold" : "bg-black/5 text-[#717682]"
                            )}
                          >
                            {count}
                          </span>
                        </DropdownMenu.Item>
                      );
                    })}
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          {/* Status buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto shrink-0 pb-0.5 sm:pb-0">
            <span className="text-xs font-semibold text-[#8e939f] shrink-0 mr-1 hidden sm:inline">
              Outcome:
            </span>
            {(['ALL', 'PASSED', 'FAILED', 'PENDING'] as const).map((status) => {
              const active = selectedStatus === status;
              const label =
                status === 'ALL'
                  ? 'All'
                  : status === 'PASSED'
                    ? '✓ Passed'
                    : status === 'FAILED'
                      ? '✗ Failed'
                      : 'Pending';

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all shrink-0 ${active
                      ? 'bg-zinc-800 text-white'
                      : 'text-[#717682] hover:bg-black/5 hover:text-[#1c2024]'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Results Header / Active Filters counter */}
      <div className="flex items-center justify-between px-2 text-xs text-[#717682]">
        <span>
          Showing <strong className="text-[#1c2024]">{filteredRounds.length}</strong> of {initialRounds.length} interview rounds
          {selectedCompany !== 'ALL' && (
            <span className="ml-1 text-[#1c2024] font-medium">for {selectedCompany}</span>
          )}
        </span>

        {(selectedCompany !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCompany('ALL');
              setSelectedStatus('ALL');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-[#8a6b00] hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reset all filters
          </button>
        )}
      </div>

      {/* 3. Rows Table */}
      {filteredRounds.length === 0 ? (
        <div className="p-12 text-center rounded-[32px] bg-white/60 backdrop-blur-2xl border border-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/70 border border-white/80 flex items-center justify-center mx-auto text-zinc-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1c2024]">No rounds match your filter</h3>
          <p className="text-xs text-[#717682] max-w-sm mx-auto">
            {selectedCompany !== 'ALL'
              ? `No interview rounds found for company "${selectedCompany}".`
              : 'Try adjusting your search query or status filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCompany('ALL');
              setSelectedStatus('ALL');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-1.5 rounded-full bg-[#1c2024] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredRounds.map((round) => {
            const formattedDate = round.scheduledDate
              ? new Date(round.scheduledDate).toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
              : 'Date pending';

            const questionsCount = round.roundQuestions?.length || 0;
            const companyInitial = round.application.companyName.charAt(0).toUpperCase();

            return (
              <Link
                key={round.id}
                href={`/rounds/${round.id}`}
                className="group block rounded-2xl bg-white/60 backdrop-blur-2xl hover:bg-white/85 border border-white/80 hover:border-white p-3.5 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left Column: Company avatar, Name, Role & Round # */}
                  <div className="flex items-center gap-3 min-w-0 md:w-1/3">
                    <div className="w-10 h-10 rounded-xl bg-[#ffcf36]/25 border border-black/5 flex items-center justify-center font-bold text-sm text-[#1c2024] shrink-0 group-hover:bg-[#ffcf36] transition-colors">
                      {companyInitial}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1c2024] group-hover:text-black truncate">
                          {round.application.companyName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 shrink-0">
                          R{round.roundNumber}
                        </span>
                      </div>
                      <p className="text-xs text-[#717682] truncate mt-0.5">
                        {round.application.jobTitle}
                      </p>
                    </div>
                  </div>

                  {/* Center Column: Round Type Badge & Scheduled Date */}
                  <div className="flex items-center gap-4 text-xs text-[#5d636f] md:w-1/3">
                    <span className="px-2.5 py-1 rounded-full bg-[#f8f7fb] text-[#6d6282] border border-[#ece8f4] font-semibold text-[10.5px] uppercase tracking-wide">
                      {round.roundType.replace(/_/g, ' ')}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-[#717682]">
                      <Calendar className="w-3.5 h-3.5 text-[#ffcf36]" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Right Column: Questions Count, Outcome Badge & Arrow */}
                  <div className="flex items-center justify-between md:justify-end gap-3 md:w-1/3">
                    <div className="flex items-center gap-1.5 text-xs text-[#717682]">
                      <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-medium text-[#1c2024]">
                        {questionsCount} {questionsCount === 1 ? 'Question' : 'Questions'}
                      </span>
                    </div>

                    <div className="shrink-0">
                      {renderOutcomeBadge(round.status)}
                    </div>

                    <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-[#ffcf36] transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4 text-[#1c2024]" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function renderOutcomeBadge(status: string) {
  switch (status) {
    case 'PASSED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF7D5] text-[#749c36] text-[11px] font-bold whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-3 h-3 text-[#749c36]" />
          Passed
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 text-[11px] font-bold whitespace-nowrap shrink-0">
          <XCircle className="w-3 h-3 text-rose-600" />
          Failed
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF7D5] text-[#749c36] text-[11px] font-bold whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-3 h-3 text-[#749c36]" />
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#ffcf36]/25 text-[#1c2024] border border-[#ffcf36]/40 text-[11px] font-bold whitespace-nowrap shrink-0">
          Pending
        </span>
      );
  }
}
