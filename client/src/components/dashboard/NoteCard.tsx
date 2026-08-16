import React from 'react';
import { Note } from '../../types/note.types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onView }) => {
  return (
    <div className="group relative w-full bg-surface border border-border rounded-xl p-5 flex flex-col justify-between transition-all duration-150 hover:border-primary hover:shadow-glow-primary">
      {/* Top Details: Department badge & Date */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge>{note.department}</Badge>
          <span className="text-[11px] font-medium text-text-secondary/70">
            {note.uploadedDate}
          </span>
        </div>

        {/* Note Title */}
        <h3 className="text-base font-semibold text-text-primary group-hover:text-white transition-colors line-clamp-2 mb-3">
          {note.title}
        </h3>

        {/* Page Count Metadata (PDF size, tags, and 'By' author removed per request) */}
        {note.pageCount && (
          <div className="flex items-center gap-1 text-xs text-text-secondary mb-4">
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>{note.pageCount} pages</span>
          </div>
        )}
      </div>

      {/* Card Action: View Button */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-end">
        <Button
          variant="secondary"
          fullWidth={false}
          onClick={() => onView(note)}
          className="text-xs px-4 py-1.5 h-8 font-medium group-hover:border-primary group-hover:text-primary"
        >
          View
        </Button>
      </div>
    </div>
  );
};
