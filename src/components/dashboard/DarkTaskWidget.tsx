'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, Trash2, CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
}

const STORAGE_KEY = 'interview_vault_tasks';

export function DarkTaskWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch {
      // ignore
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      subtitle: dateStr,
      completed: false,
    };

    saveTasks([newTask, ...tasks]);
    setNewTitle('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updated);
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col rounded-[32px] bg-[#1c2024] text-white p-6 shadow-xl gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-white">Interview Tasks</h3>
          <p className="text-xs text-zinc-400">Preparation checklist</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-light tracking-tight text-white">
            <span className="font-semibold">{completedCount}</span>/{tasks.length}
          </div>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#ffcf36] hover:text-[#1c2024] text-white flex items-center justify-center transition-colors"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Task Input Form */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Review STAR stories..."
            autoFocus
            className="flex-1 rounded-xl bg-white/10 border border-white/20 px-3 py-1.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/70"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-[#ffcf36] text-[#1c2024] text-xs font-bold hover:bg-[#fed65a] transition-colors"
          >
            Add
          </button>
        </form>
      )}

      {/* Task List */}
      <div className="max-h-[260px] space-y-2.5 overflow-y-auto pr-1">
        {mounted && tasks.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-white/[0.03] border border-dashed border-white/10">
            <CheckSquare className="w-7 h-7 text-zinc-500 mx-auto mb-2" />
            <p className="text-xs text-zinc-300 font-medium">No tasks yet</p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Add your prep checklist items to track progress
            </p>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#ffcf36] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Add your first task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-left group"
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={task.completed}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    task.completed
                      ? 'bg-[#ffcf36] text-[#1c2024] ring-2 ring-[#ffcf36]/30'
                      : 'border border-zinc-600 bg-transparent'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${
                      task.completed ? 'text-zinc-400 line-through' : 'text-zinc-200'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{task.subtitle}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={(e) => deleteTask(task.id, e)}
                aria-label="Delete task"
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
