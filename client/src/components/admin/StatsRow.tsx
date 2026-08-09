import React from 'react';
import { AdminStats } from '../../types/admin.types';

export interface StatsRowProps {
  stats: AdminStats;
  selectedDepartment?: string | null;
  onSelectDepartment?: (department: string | null) => void;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  stats,
  selectedDepartment,
  onSelectDepartment,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stat Card 1: Total Notes */}
      <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Total Notes
          </span>
          <div className="text-3xl font-bold text-text-primary mt-1">
            {stats.totalNotes}
          </div>
          <span className="text-[11px] text-primary mt-1 inline-block">
            Published in repository
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      {/* Stat Card 2: Total Users */}
      <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Total Users
          </span>
          <div className="text-3xl font-bold text-text-primary mt-1">
            {stats.totalUsers}
          </div>
          <span className="text-[11px] text-secondary mt-1 inline-block">
            Registered students & admins
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      {/* Stat Card 3: Notes per Department Breakdown List */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Notes per Department
            </span>
            <span className="text-[10px] text-text-secondary/70">Click to filter</span>
          </div>

          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
            {stats.departmentBreakdown.map((item) => {
              const isSelected = selectedDepartment === item.department;
              return (
                <button
                  key={item.department}
                  type="button"
                  onClick={() => {
                    if (onSelectDepartment) {
                      onSelectDepartment(isSelected ? null : item.department);
                    }
                  }}
                  className={`w-full flex items-center justify-between text-xs py-1 px-2.5 rounded transition-all text-left ${
                    isSelected
                      ? 'bg-primary/20 border border-primary text-white font-semibold'
                      : 'bg-surface-elevated/70 border border-border/40 hover:border-primary/50 hover:bg-surface-elevated text-text-primary'
                  }`}
                  title={`Filter notes table by ${item.department}`}
                >
                  <span className="truncate max-w-[180px]">
                    {item.department}
                  </span>
                  <span className="font-mono text-secondary font-semibold shrink-0 ml-2">
                    {item.count} {item.count === 1 ? 'note' : 'notes'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

