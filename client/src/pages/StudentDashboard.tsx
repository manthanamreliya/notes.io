import React, { useState, useMemo, useEffect } from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DepartmentCard } from '../components/dashboard/DepartmentCard';
import { NoteCard } from '../components/dashboard/NoteCard';
import { NoteViewer } from '../components/dashboard/NoteViewer';
import { MacSearchInput } from '../components/dashboard/MacSearchInput';
import { Note } from '../types/note.types';
import { UserRole } from '../types/auth.types';
import { initialDepartments } from '../data/mockData';
import { getNotes, getDepartments } from '../api/notes.api';

export interface StudentDashboardProps {
  currentRole?: UserRole;
  onNavigateHome?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [departments, setDepartments] = useState<string[]>(initialDepartments);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeViewNote, setActiveViewNote] = useState<Note | null>(null);

  // Parse active department from URL path if present (e.g. /dashboard/Computer%20Science)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/dashboard/')) {
      const deptFromUrl = decodeURIComponent(path.replace('/dashboard/', ''));
      return deptFromUrl || null;
    }
    return null;
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [notesRes, deptsRes] = await Promise.all([getNotes(), getDepartments()]);
      if (notesRes.success && Array.isArray(notesRes.data)) {
        const formattedNotes: Note[] = notesRes.data.map((n: any) => ({
          id: n._id || n.id,
          title: n.title,
          department: typeof n.department === 'object' ? n.department?.name : n.department,
          tags: n.tags || [],
          uploadedDate: n.createdAt ? new Date(n.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          fileSize: 'PDF Document',
          pageCount: n.pageCount || 1,
          author: typeof n.uploadedBy === 'object' ? n.uploadedBy?.name : 'Admin',
        }));
        setNotes(formattedNotes);
      }

      if (deptsRes.success && Array.isArray(deptsRes.data) && deptsRes.data.length > 0) {
        setDepartments(deptsRes.data.map((d: any) => d.name));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/dashboard/')) {
        const deptFromUrl = decodeURIComponent(path.replace('/dashboard/', ''));
        setSelectedDepartment(deptFromUrl || null);
      } else {
        setSelectedDepartment(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute unique list of departments with note counts
  const departmentStats = useMemo(() => {
    const countsMap: Record<string, number> = {};

    departments.forEach((dept) => {
      countsMap[dept] = 0;
    });

    notes.forEach((note) => {
      countsMap[note.department] = (countsMap[note.department] || 0) + 1;
    });

    return Object.entries(countsMap).map(([department, count]) => ({
      department,
      count,
    }));
  }, [notes, departments]);

  // Contextual search filtering for Departments view vs Notes view
  const filteredDepartments = useMemo(() => {
    if (selectedDepartment) return [];
    return departmentStats.filter((item) =>
      item.department.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [departmentStats, searchQuery, selectedDepartment]);

  const filteredNotes = useMemo(() => {
    if (!selectedDepartment) return [];
    return notes.filter((note) => {
      const matchesDept = note.department.toLowerCase() === selectedDepartment.toLowerCase();
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesDept && matchesSearch;
    });
  }, [notes, selectedDepartment, searchQuery]);

  const handleSelectDepartment = (dept: string) => {
    setSelectedDepartment(dept);
    setSearchQuery('');
    window.history.pushState({}, '', `/dashboard/${encodeURIComponent(dept)}`);
  };

  const handleBackToDepartments = () => {
    setSelectedDepartment(null);
    setSearchQuery('');
    window.history.pushState({}, '', '/dashboard');
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Top Header Bar */}
      <DashboardHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Breadcrumb / Back Button for Department Detail View */}
        {selectedDepartment && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleBackToDepartments}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border/80 text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-primary/60 transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Departments</span>
            </button>

            <span className="text-xs text-text-secondary font-mono">
              Department &bull; {selectedDepartment}
            </span>
          </div>
        )}

        {/* View Title & Contextual Search Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              {selectedDepartment ? selectedDepartment : 'Browse Engineering Departments'}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {selectedDepartment
                ? `Available study materials and notes for ${selectedDepartment}.`
                : 'Select a department below to access curriculum notes, cheat sheets, and study materials.'}
            </p>
          </div>

          {/* MacBook Finder Style Contextual Search Input */}
          <div className="w-full sm:w-80 md:w-96 shrink-0">
            <MacSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={
                selectedDepartment
                  ? `Search ${selectedDepartment} notes...`
                  : 'Search departments...'
              }
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-text-secondary text-sm">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            Loading study material catalog...
          </div>
        ) : (
          <>
            {/* 1. Main Department Cards Grid View (Default) */}
            {!selectedDepartment && (
              <>
                {filteredDepartments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    {filteredDepartments.map(({ department, count }) => (
                      <DepartmentCard
                        key={department}
                        department={department}
                        noteCount={count}
                        onClick={handleSelectDepartment}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty Search State for Departments */
                  <div className="w-full bg-surface border border-border/80 rounded-2xl p-12 text-center my-8 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mb-4">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">No departments found</h3>
                    <p className="text-sm text-text-secondary max-w-sm mt-1 mb-4">
                      We couldn't find any department matching "{searchQuery}".
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-semibold text-primary hover:text-primary-hover underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 2. Department Note List View */}
            {selectedDepartment && (
              <>
                {filteredNotes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    {filteredNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onView={(n) => setActiveViewNote(n)}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty Notes State inside Department */
                  <div className="w-full bg-surface border border-border/80 rounded-2xl p-12 text-center my-8 flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center mb-4">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">No notes found</h3>
                    <p className="text-sm text-text-secondary max-w-sm mt-1 mb-4">
                      {searchQuery
                        ? `No notes matching "${searchQuery}" in ${selectedDepartment}.`
                        : `There are currently no published notes in ${selectedDepartment}.`}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs font-semibold text-primary hover:text-primary-hover underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-border/40 bg-surface-elevated text-xs text-text-secondary mt-12">
        &copy; {new Date().getFullYear()} Engineering Notes.io &bull; Student Portal
      </footer>

      {/* PDF Note Viewer Modal */}
      <NoteViewer
        note={activeViewNote}
        isOpen={Boolean(activeViewNote)}
        onClose={() => setActiveViewNote(null)}
      />
    </div>
  );
};
