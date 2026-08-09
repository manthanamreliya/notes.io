import React from 'react';

export interface MacSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MacSearchInput: React.FC<MacSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search notes...',
}) => {
  return (
    <div className="relative w-full group">
      <div className="relative flex items-center w-full rounded-full bg-surface-elevated/90 border border-border/80 shadow-md shadow-black/20 backdrop-blur-md transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 focus-within:shadow-glow-primary hover:border-border">
        {/* Left Search Icon (Macbook Finder Style) */}
        <div className="pl-4 text-text-secondary/70 group-focus-within:text-primary transition-colors flex items-center justify-center pointer-events-none">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input Element */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search notes"
          className="w-full bg-transparent py-2.5 pl-3 pr-10 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none font-medium"
        />

        {/* Right Badge / Clear Action */}
        <div className="pr-3 flex items-center gap-1.5">
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 rounded-full text-text-secondary/60 hover:text-text-primary hover:bg-surface/80 transition-all focus:outline-none"
              title="Clear search"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-text-secondary/60 bg-surface/80 border border-border/60 rounded-md select-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
};
