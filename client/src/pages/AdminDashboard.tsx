import React, { useState, useMemo } from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsRow } from '../components/admin/StatsRow';
import { UsersTable } from '../components/admin/UsersTable';
import { NotesTable } from '../components/admin/NotesTable';
import { AddNoteModal } from '../components/admin/AddNoteModal';
import { ManageDepartmentsModal } from '../components/admin/ManageDepartmentsModal';
import { Button } from '../components/common/Button';
import { Note } from '../types/note.types';
import { AdminUser } from '../types/admin.types';
import { UserRole } from '../types/auth.types';
import { mockNotes, mockUsers, initialDepartments, computeStats, deleteNote } from '../data/mockData';

export interface AdminDashboardProps {
  currentRole?: UserRole;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentRole,
  onNavigateHome,
}) => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [users] = useState<AdminUser[]>(mockUsers);
  const [departments, setDepartments] = useState<string[]>(initialDepartments);
  
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isManageDeptOpen, setIsManageDeptOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Derived note counts by department map
  const noteCountsByDept = useMemo(() => {
    const countsMap: Record<string, number> = {};
    departments.forEach((dept) => {
      countsMap[dept] = 0;
    });
    notes.forEach((note) => {
      countsMap[note.department] = (countsMap[note.department] || 0) + 1;
    });
    return countsMap;
  }, [notes, departments]);

  // Recompute stats dynamically as notes/users/departments change
  const stats = useMemo(() => computeStats(notes, users, departments), [notes, users, departments]);

  const handleAddDepartment = (newDept: string) => {
    if (!departments.includes(newDept)) {
      setDepartments((prev) => [...prev, newDept]);
      showToast(`Department "${newDept}" created.`, 'success');
    }
  };

  const handleRenameDepartment = (oldName: string, newName: string) => {
    // 1. Update departments list
    setDepartments((prev) => prev.map((d) => (d === oldName ? newName : d)));
    // 2. Update notes belonging to oldName department
    setNotes((prev) =>
      prev.map((n) => (n.department === oldName ? { ...n, department: newName } : n))
    );
    // 3. Update active filter if applicable
    if (selectedDepartmentFilter === oldName) {
      setSelectedDepartmentFilter(newName);
    }
    showToast(`Department renamed to "${newName}".`, 'info');
  };

  const handleDeleteDepartment = (deptName: string) => {
    const count = noteCountsByDept[deptName] || 0;
    if (count > 0) return; // Guard against deleting departments with notes

    setDepartments((prev) => prev.filter((d) => d !== deptName));
    if (selectedDepartmentFilter === deptName) {
      setSelectedDepartmentFilter(null);
    }
    showToast(`Department "${deptName}" removed.`, 'info');
  };

  const handleNoteAdded = (newNote: Note) => {
    // If note department is not in departments list, add it
    if (!departments.includes(newNote.department)) {
      setDepartments((prev) => [...prev, newNote.department]);
    }
    setNotes((prev) => [newNote, ...prev]);
    showToast(`Note "${newNote.title}" published successfully!`, 'success');
  };

  const handleDeleteNote = async (noteId: string) => {
    const targetNote = notes.find((n) => n.id === noteId);
    if (!targetNote) return;

    await deleteNote(noteId);

    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast(`Note "${targetNote.title}" removed.`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col selection:bg-primary selection:text-white">
      {/* Top Bar Header */}
      <DashboardHeader
        currentRole={currentRole}
        onNavigateHome={onNavigateHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Admin Control Panel
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage study material uploads, department structure, and repository metrics.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Button
              variant="secondary"
              fullWidth={false}
              onClick={() => setIsManageDeptOpen(true)}
              className="text-xs sm:text-sm px-4 py-2.5 font-semibold"
            >
              Manage Departments
            </Button>
            <Button
              variant="primary"
              fullWidth={false}
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs sm:text-sm px-4 py-2.5 shadow-sm shadow-glow-primary font-semibold"
            >
              + Add Note
            </Button>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {notification && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-primary/40 text-text-primary text-xs font-medium flex items-center justify-between shadow-glow-primary/20 animate-form-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-text-secondary hover:text-text-primary text-xs font-bold px-1"
            >
              &times;
            </button>
          </div>
        )}

        {/* Stats Row Section */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            System Overview
          </h2>
          <StatsRow
            stats={stats}
            selectedDepartment={selectedDepartmentFilter}
            onSelectDepartment={(dept) => setSelectedDepartmentFilter(dept)}
          />
        </section>

        {/* Published Notes Table Section */}
        <section className="space-y-3">
          <NotesTable
            notes={notes}
            onDeleteNote={handleDeleteNote}
            filterDepartment={selectedDepartmentFilter}
            onClearDepartmentFilter={() => setSelectedDepartmentFilter(null)}
          />
        </section>

        {/* Users Table Section */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            User Accounts
          </h2>
          <UsersTable users={users} />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-border/40 bg-surface-elevated text-xs text-text-secondary mt-12">
        &copy; {new Date().getFullYear()} Engineering Notes.io &bull; Admin Management Portal
      </footer>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingDepartments={departments}
        onNoteAdded={handleNoteAdded}
      />

      {/* Manage Departments Modal */}
      <ManageDepartmentsModal
        isOpen={isManageDeptOpen}
        onClose={() => setIsManageDeptOpen(false)}
        departments={departments}
        noteCountsByDept={noteCountsByDept}
        onAddDepartment={handleAddDepartment}
        onRenameDepartment={handleRenameDepartment}
        onDeleteDepartment={handleDeleteDepartment}
      />
    </div>
  );
};

