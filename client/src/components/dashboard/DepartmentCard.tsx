import React from 'react';

export interface DepartmentCardProps {
  department: string;
  noteCount: number;
  onClick: (department: string) => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  noteCount,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(department)}
      className="group relative w-full bg-surface border border-border rounded-xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-glow-primary hover:-translate-y-0.5"
    >
      <div>
        {/* Top Department Icon & Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7" />
            </svg>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-elevated text-text-secondary border border-border/60 font-mono">
            {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          </span>
        </div>

        {/* Department Name Title */}
        <h3 className="text-lg font-bold text-text-primary group-hover:text-white transition-colors line-clamp-2">
          {department}
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          Explore course notes, guides, and study materials
        </p>
      </div>

      {/* Bottom Action Affordance */}
      <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary-hover">
        <span>View Department Notes</span>
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};
