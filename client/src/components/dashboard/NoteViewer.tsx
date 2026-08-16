import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../../types/note.types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { getNoteViewUrl } from '../../api/notes.api';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface NoteViewerProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NoteViewer: React.FC<NoteViewerProps> = ({
  note,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [watermarkTimestamp, setWatermarkTimestamp] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>(600);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          const padding = window.innerWidth < 640 ? 32 : 64;
          const calculatedWidth = Math.min(width - padding, 780);
          setPageWidth(Math.max(280, calculatedWidth));
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isOpen, signedUrl]);

  useEffect(() => {
    if (isOpen && note) {
      setIsLoadingUrl(true);
      setUrlError(null);
      setSignedUrl(null);
      setWatermarkTimestamp(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');

      // Fetch fresh signed URL from backend
      getNoteViewUrl(note.id)
        .then((res) => {
          if (res.success && res.data?.viewUrl) {
            setSignedUrl(res.data.viewUrl);
          } else {
            setUrlError(res.message || 'Failed to retrieve secure view URL');
          }
        })
        .catch(() => {
          setUrlError('An unexpected error occurred while loading the note preview.');
        })
        .finally(() => {
          setIsLoadingUrl(false);
        });
    } else {
      setSignedUrl(null);
    }
  }, [isOpen, note]);

  if (!isOpen || !note) return null;

  const userWatermarkText = user
    ? `${user.name} (${user.email})`
    : 'Notes.io Verified Student';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${note.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#0a0e1a]/95 backdrop-blur-md select-none"
      onContextMenu={(e) => e.preventDefault()}
      onClick={onClose}
    >
      {/* Inject print-blocking CSS */}
      <style>{`
        @media print {
          html, body {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-surface-elevated border border-primary/30 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#4f7cff] via-[#60a5fa] to-[#4f7cff]" />

        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center justify-between gap-3 bg-surface">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0">
            <Badge>{note.department}</Badge>
            <h2 className="text-sm sm:text-lg font-semibold text-text-primary truncate">
              {note.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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

        {/* Main Viewer Body (React-PDF Canvas Stream with Dynamic Tiled Watermark) */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-y-auto p-3 sm:p-8 bg-[#070a14] flex flex-col items-center justify-start min-h-[360px] select-none"
        >
          {isLoadingUrl ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-text-secondary m-auto">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium text-text-primary">Generating secure document view...</p>
              <p className="text-xs text-text-secondary mt-1">Verifying permissions & creating short-lived signed URL</p>
            </div>
          ) : urlError ? (
            <div className="p-8 bg-error/10 border border-error/30 rounded-xl text-center max-w-md m-auto">
              <div className="text-error font-semibold mb-2">Failed to load note</div>
              <p className="text-xs text-text-secondary">{urlError}</p>
            </div>
          ) : signedUrl ? (
            <Document
              file={signedUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="p-12 text-center text-text-secondary text-sm m-auto">
                  Loading PDF document canvas...
                </div>
              }
              error={
                <div className="p-8 text-center text-error text-sm m-auto">
                  Error rendering PDF canvas stream.
                </div>
              }
              className="flex flex-col items-center gap-6 w-full"
            >
              {Array.from({ length: numPages }, (_, index) => (
                <div
                  key={`page_${index + 1}`}
                  className="relative border border-border/80 rounded-lg shadow-2xl overflow-hidden bg-white max-w-full"
                >
                  {/* Dynamic Watermark Overlay over Canvas */}
                  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden flex flex-wrap items-center justify-center gap-8 sm:gap-12 p-4 sm:p-8 opacity-15 select-none">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="rotate-[-25deg] text-xs sm:text-sm font-mono font-bold tracking-widest text-black text-center"
                      >
                        <div>{userWatermarkText}</div>
                        <div className="text-[10px] opacity-75">{watermarkTimestamp}</div>
                      </div>
                    ))}
                  </div>

                  <Page
                    pageNumber={index + 1}
                    width={pageWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="max-w-full h-auto"
                  />
                </div>
              ))}
            </Document>
          ) : null}
        </div>

        {/* Bottom Status Bar */}
        <div className="px-4 sm:px-6 py-3 border-t border-border bg-surface flex items-center justify-between text-xs text-text-secondary">
          <span className="font-mono text-text-primary text-[11px] sm:text-xs">
            {numPages} {numPages === 1 ? 'Page' : 'Pages'}
          </span>

          <span className="text-[10px] sm:text-[11px] font-mono text-text-secondary/70 truncate max-w-[200px] sm:max-w-sm">
            {userWatermarkText}
          </span>
        </div>
      </div>
    </div>
  );
};
