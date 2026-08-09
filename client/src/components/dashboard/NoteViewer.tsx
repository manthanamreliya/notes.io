import React, { useState } from 'react';
import { Note } from '../../types/note.types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export interface NoteViewerProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * NoteViewer Component - Read-only PDF viewer overlay.
 * Canvas-rendered, watermarked viewer stub ready to connect with PDF.js / PDF canvas renderer backend.
 */
export const NoteViewer: React.FC<NoteViewerProps> = ({
  note,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = note?.pageCount || 12;

  if (!isOpen || !note) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${note.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0a0e1a]/95 backdrop-blur-md select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-surface-elevated border border-primary/30 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#4f7cff] via-[#60a5fa] to-[#4f7cff]" />

        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4 bg-surface">
          <div className="flex items-center gap-3 overflow-hidden">
            <Badge>{note.department}</Badge>
            <h2 className="text-base sm:text-lg font-semibold text-text-primary truncate">
              {note.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Download Disabled Notice */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-error/10 border border-error/20 text-error text-[11px] font-medium">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Download Disabled (Read-Only)
            </span>

            <Button
              variant="secondary"
              fullWidth={false}
              onClick={onClose}
              className="text-xs px-3 py-1.5 h-8 border-border"
            >
              Close
            </Button>
          </div>
        </div>

        {/* Main Viewer Body (Stub Canvas Container with Watermark) */}
        <div className="relative flex-1 overflow-y-auto p-4 sm:p-8 bg-[#070a14] flex flex-col items-center justify-center min-h-[420px]">
          {/* Background Diagonal Watermark Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-10">
            <div className="rotate-[-25deg] text-4xl sm:text-6xl font-black uppercase tracking-widest text-primary whitespace-nowrap select-none">
              Notes.io &bull; Read-Only Preview &bull; Notes.io
            </div>
          </div>

          {/* PDF Page Canvas Placeholder Frame */}
          <div className="relative w-full max-w-2xl bg-surface border border-border/80 rounded-lg shadow-2xl p-6 sm:p-10 flex flex-col items-center text-center">
            {/* Watermark Tag across Mock Page */}
            <div className="absolute top-3 right-3 text-[10px] font-mono text-text-secondary/60 uppercase tracking-widest border border-border/60 px-2 py-0.5 rounded">
              Watermarked Canvas
            </div>

            {/* Document Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mb-4 shadow-glow-primary/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-text-primary mb-1">
              {note.title}
            </h3>
            <p className="text-xs text-text-secondary mb-6">
              Department: {note.department} &bull; Page {currentPage} of {totalPages}
            </p>

            {/* Stub Page Content Lines Simulation */}
            <div className="w-full space-y-3 mb-8 px-4 opacity-75">
              <div className="h-3 bg-surface-elevated rounded-full w-3/4 mx-auto" />
              <div className="h-2.5 bg-surface-elevated rounded-full w-full" />
              <div className="h-2.5 bg-surface-elevated rounded-full w-5/6 mx-auto" />
              <div className="h-2.5 bg-surface-elevated rounded-full w-4/5 mx-auto" />
              <div className="h-24 bg-surface-elevated/40 rounded-lg w-full flex items-center justify-center border border-dashed border-border/60 text-xs text-text-secondary/80">
                PDF viewer goes here (Canvas-rendered PDF stream)
              </div>
            </div>

            {/* Note Metadata Details */}
            <div className="w-full pt-4 border-t border-border/60 flex flex-wrap items-center justify-between text-xs text-text-secondary">
              <span>Author: {note.author || 'Notes.io Verified'}</span>
              <span>Size: {note.fileSize || '2.5 MB'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Pagination & Status Bar */}
        <div className="px-6 py-3 border-t border-border bg-surface flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-surface-elevated border border-border hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="font-mono text-text-primary">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-surface-elevated border border-border hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <span className="text-[11px] font-mono text-text-secondary/70">
            [STUB: NoteViewer.tsx ready for PDF canvas stream]
          </span>
        </div>
      </div>
    </div>
  );
};
