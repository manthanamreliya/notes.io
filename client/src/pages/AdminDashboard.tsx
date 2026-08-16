import React, { useState, useMemo, useEffect } from 'react';
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
import { mockUsers, initialDepartments, computeStats } from '../data/mockData';
import { getAdminNotes, getDepartments, getAdminUsers } from '../api/notes.api';

export interface AdminDashboardProps {
  currentRole?: UserRole;
  onNavigateHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [departments, setDepartments] = useState<string[]>(initialDepartments);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isManageDeptOpen, setIsManageDeptOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [notesRes, deptsRes, usersRes] = await Promise.all([
        getAdminNotes(),
        getDepartments(),
        getAdminUsers(),
      ]);

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

      if (usersRes.success && Array.isArray(usersRes.data) && usersRes.data.length > 0) {
        const formattedUsers: AdminUser[] = usersRes.data.map((u: any) => ({
          id: u.id || u._id,
          name: u.name,
          email: u.email,
          mobileNumber: u.mobileNumber || u.mobile || 'N/A',
          role: u.role || 'student',
          joinedDate: u.joinedDate || (u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        }));
        setUsers(formattedUsers);
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
    setDepartments((prev) => prev.map((d) => (d === oldName ? newName : d)));
    setNotes((prev) =>
      prev.map((n) => (n.department === oldName ? { ...n, department: newName } : n))
    );
    if (selectedDepartmentFilter === oldName) {
      setSelectedDepartmentFilter(newName);
    }
    showToast(`Department renamed to "${newName}".`, 'info');
  };

  const handleDeleteDepartment = (deptName: string) => {
    const count = noteCountsByDept[deptName] || 0;
    if (count > 0) return;

    setDepartments((prev) => prev.filter((d) => d !== deptName));
    if (selectedDepartmentFilter === deptName) {
      setSelectedDepartmentFilter(null);
    }
    showToast(`Department "${deptName}" removed.`, 'info');
  };

  const handleNoteAdded = (newNote: Note) => {
    if (!departments.includes(newNote.department)) {
      setDepartments((prev) => [...prev, newNote.department]);
    }
    setNotes((prev) => [newNote, ...prev]);
    showToast(`Note "${newNote.title}" published successfully!`, 'success');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast('Note deleted successfully.', 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Top Bar Header */}
      <DashboardHeader />

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

        {isLoading ? (
          <div className="p-12 text-center text-text-secondary text-sm">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            Loading notes repository...
          </div>
        ) : (
          <>
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
          </>
        )}
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
