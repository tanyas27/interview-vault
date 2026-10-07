'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, Check } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  done: boolean;
}

const STORAGE_KEY = 'interview_vault_topics';

export function TopicsWidget() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTopics(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (next: Topic[]) => {
    setTopics(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    save([{ id: crypto.randomUUID(), title, done: false }, ...topics]);
    setNewTitle('');
    setIsAdding(false);
  };

  const toggle = (id: string) =>
    save(topics.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    save(topics.filter((t) => t.id !== id));
  };

  const pending = topics.filter((t) => !t.done);
  const done = topics.filter((t) => t.done);

  return (
    <div className="h-[360px] flex flex-col rounded-[32px] border border-white/85 bg-white/60 backdrop-blur-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] gap-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-bold text-base text-[#1c2024]">To Learn / Read Next</h3>
          <p className="text-xs text-[#717682]">
            {pending.length} topic{pending.length !== 1 ? 's' : ''} remaining
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="w-8 h-8 rounded-full border border-white/80 bg-white/70 hover:bg-white text-[#1c2024] shadow-2xs flex items-center justify-center transition-colors"
          aria-label="Add topic"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Input */}
      {isAdding && (
        <form onSubmit={handleAdd} className="flex gap-2 shrink-0">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. System design basics..."
            autoFocus
            className="flex-1 rounded-xl border border-white/80 bg-white/80 px-3 py-1.5 text-xs text-[#1c2024] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/60 shadow-2xs"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-[#1c2024] text-white text-xs font-bold hover:bg-black transition-colors"
          >
            Add
          </button>
        </form>
      )}

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {mounted && topics.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-6">
            <BookOpen className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs text-[#717682] font-medium">Nothing queued up yet</p>
            <p className="text-[11px] text-zinc-400 mt-1">Add topics you want to study or read</p>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#1c2024] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Add your first topic
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {pending.map((topic) => (
              <TopicRow key={topic.id} topic={topic} onToggle={toggle} onDelete={remove} />
            ))}
            {done.length > 0 && (
              <>
                <p className="pt-2 pb-0.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Done
                </p>
                {done.map((topic) => (
                  <TopicRow key={topic.id} topic={topic} onToggle={toggle} onDelete={remove} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TopicRow({
  topic,
  onToggle,
  onDelete,
}: {
  topic: Topic;
  onToggle: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}) {
  return (
    <div className="group flex items-center gap-2.5 px-2.5 py-2 rounded-2xl hover:bg-white/60 transition-colors">
      <button
        type="button"
        onClick={() => onToggle(topic.id)}
        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
          topic.done
            ? 'bg-[#ffcf36] border-[#ffcf36]'
            : 'border-zinc-300 hover:border-[#1c2024]'
        }`}
        aria-label={topic.done ? 'Mark as not done' : 'Mark as done'}
      >
        {topic.done && <Check className="w-3 h-3 text-[#1c2024] stroke-[3]" />}
      </button>
      <span
        className={`flex-1 text-xs font-medium min-w-0 truncate ${
          topic.done ? 'line-through text-zinc-400' : 'text-[#1c2024]'
        }`}
      >
        {topic.title}
      </span>
      <button
        type="button"
        onClick={(e) => onDelete(topic.id, e)}
        aria-label="Remove topic"
        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 transition-opacity shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
