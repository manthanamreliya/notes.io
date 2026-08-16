import React, { useState, useMemo } from 'react';
import { Note } from '../../types/note.types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { deleteNote as deleteNoteApi } from '../../api/notes.api';

export interface NotesTableProps {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
  filterDepartment?: string | null;
  onClearDepartmentFilter?: () => void;
}

export const NotesTable: React.FC<NotesTableProps> = ({
  notes,
  onDeleteNote,
  filterDepartment,
  onClearDepartmentFilter,
}) => {
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [isSortedByDept, setIsSortedByDept] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Apply department filter & sorting
  const processedNotes = useMemo(() => {
    let result = [...notes];

    if (filterDepartment) {
      result = result.filter(
        (n) => n.department.toLowerCase() === filterDepartment.toLowerCase()
      );
    }

    if (isSortedByDept) {
      result.sort((a, b) => {
        const comp = a.department.localeCompare(b.department);
        return sortAsc ? comp : -comp;
      });
    }

    return result;
  }, [notes, filterDepartment, isSortedByDept, sortAsc]);

  const toggleDeptSort = () => {
    if (!isSortedByDept) {
      setIsSortedByDept(true);
      setSortAsc(true);
    } else if (sortAsc) {
      setSortAsc(false);
    } else {
      setIsSortedByDept(false);
    }
  };

  const handleDelete = async (note: Note) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete note "${note.title}"? This action will remove the file from Cloudinary and database permanently.`
    );
    if (!confirmed) return;

    setDeletingId(note.id);
    try {
      const res = await deleteNoteApi(note.id);
      if (res.success) {
        onDeleteNote(note.id);
      } else {
        alert(res.message || 'Failed to delete note');
      }
    } catch {
      alert('An error occurred while deleting the note.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header bar with total & active filter */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-text-primary">
            Published Notes ({processedNotes.length})
          </h2>

          {filterDepartment && (
            <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/40 px-2.5 py-1 rounded-full text-xs text-primary font-medium">
              <span>Filter: {filterDepartment}</span>
              {onClearDepartmentFilter && (
                <button
                  type="button"
                  onClick={onClearDepartmentFilter}
                  className="hover:text-white font-bold ml-1"
                  title="Clear department filter"
                >
                  &times;
                </button>
              )}
            </div>
          )}
        </div>

        <span className="text-xs text-text-secondary">
          Click Department header to sort
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-text-primary">
          <thead className="bg-surface-elevated text-[11px] font-semibold uppercase tracking-wider text-text-secondary border-b border-border">
            <tr>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                <button
                  type="button"
                  onClick={toggleDeptSort}
                  className="inline-flex items-center gap-1 hover:text-text-primary focus:outline-none transition-colors"
                >
                  <span>Department</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={
                        !isSortedByDept
                          ? 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
                          : sortAsc
                          ? 'M5 15l7-7 7 7'
                          : 'M19 9l-7 7-7-7'
                      }
                    />
                  </svg>
                </button>
              </th>
              <th scope="col" className="px-6 py-3">
                Uploaded Date
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {processedNotes.length > 0 ? (
              processedNotes.map((note) => (
                <tr
                  key={note.id}
                  className="hover:bg-surface-elevated/60 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-text-primary">
                    <div className="flex flex-col">
                      <span className="truncate max-w-xs sm:max-w-md font-semibold">
                        {note.title}
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        {note.fileSize || 'PDF Document'} &bull; {note.author || 'Admin'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge>{note.department}</Badge>
                  </td>
                  <td className="px-6 py-4 text-text-secondary whitespace-nowrap font-mono text-xs">
                    {note.uploadedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button
                      variant="secondary"
                      fullWidth={false}
                      disabled={deletingId === note.id}
                      isLoading={deletingId === note.id}
                      onClick={() => handleDelete(note)}
                      className="text-xs px-3 py-1 h-7 border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-500 hover:bg-red-500/10"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-text-secondary text-xs">
                  No notes found matching the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
