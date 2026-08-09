import React from 'react';

export interface SubjectFilterProps {
  subjects: string[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
}

export const SubjectFilter: React.FC<SubjectFilterProps> = ({
  subjects,
  selectedSubject,
  onSelectSubject,
}) => {
  const allSubjects = ['All', ...subjects];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
      {allSubjects.map((subject) => {
        const isSelected = selectedSubject === subject;
        return (
          <button
            key={subject}
            type="button"
            onClick={() => onSelectSubject(subject)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isSelected
                ? 'bg-primary text-white shadow-sm shadow-glow-primary'
                : 'bg-surface text-text-secondary border border-border hover:border-primary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            {subject}
          </button>
        );
      })}
    </div>
  );
};
