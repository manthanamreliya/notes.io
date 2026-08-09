import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export interface ManageDepartmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
  noteCountsByDept: Record<string, number>;
  onAddDepartment: (newDeptName: string) => void;
  onRenameDepartment: (oldName: string, newName: string) => void;
  onDeleteDepartment: (deptName: string) => void;
}

export const ManageDepartmentsModal: React.FC<ManageDepartmentsModalProps> = ({
  isOpen,
  onClose,
  departments,
  noteCountsByDept,
  onAddDepartment,
  onRenameDepartment,
  onDeleteDepartment,
}) => {
  const [newDeptInput, setNewDeptInput] = useState<string>('');
  const [editingDept, setEditingDept] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newDeptInput.trim();
    if (!trimmed) return;

    if (departments.some((d) => d.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`Department "${trimmed}" already exists.`);
      return;
    }

    onAddDepartment(trimmed);
    setNewDeptInput('');
    setErrorMsg(null);
  };

  const startEditing = (dept: string) => {
    setEditingDept(dept);
    setEditingValue(dept);
    setErrorMsg(null);
  };

  const handleRenameSubmit = (oldName: string) => {
    const trimmed = editingValue.trim();
    if (!trimmed || trimmed === oldName) {
      setEditingDept(null);
      return;
    }

    if (
      departments.some(
        (d) => d.toLowerCase() === trimmed.toLowerCase() && d !== oldName
      )
    ) {
      setErrorMsg(`Department "${trimmed}" already exists.`);
      return;
    }

    onRenameDepartment(oldName, trimmed);
    setEditingDept(null);
    setEditingValue('');
    setErrorMsg(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Departments">
      <div className="p-6 space-y-6 animate-form-fade-in">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-xs">
            {errorMsg}
          </div>
        )}

        {/* Add New Department Form */}
        <form onSubmit={handleAddSubmit} className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary select-none">
            Create New Department
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                id="new-department"
                label="Department Name"
                placeholder="e.g. Aerospace Engineering"
                value={newDeptInput}
                onChange={(e) => {
                  setNewDeptInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth={false}
              disabled={!newDeptInput.trim()}
              className="text-xs px-4 py-3 shrink-0 font-semibold"
            >
              + Add
            </Button>
          </div>
        </form>

        {/* Existing Departments List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary select-none">
              Existing Departments ({departments.length})
            </span>
          </div>

          <div className="divide-y divide-border/60 max-h-72 overflow-y-auto border border-border/80 rounded-xl bg-surface">
            {departments.map((dept) => {
              const count = noteCountsByDept[dept] || 0;
              const isEditing = editingDept === dept;

              return (
                <div
                  key={dept}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-surface-elevated/50 transition-colors"
                >
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-md bg-surface border border-primary text-text-primary text-xs focus:outline-none"
                        autoFocus
                      />
                      <Button
                        variant="primary"
                        fullWidth={false}
                        onClick={() => handleRenameSubmit(dept)}
                        className="text-xs px-3 py-1 h-7"
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        fullWidth={false}
                        onClick={() => setEditingDept(null)}
                        className="text-xs px-2.5 py-1 h-7"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm font-semibold text-text-primary truncate">
                          {dept}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-surface-elevated text-secondary border border-border/60 shrink-0">
                          {count} {count === 1 ? 'note' : 'notes'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditing(dept)}
                          className="text-xs text-text-secondary hover:text-primary transition-colors px-2 py-1"
                        >
                          Rename
                        </button>

                        {/* Delete Action (Disabled if notes exist) */}
                        {count > 0 ? (
                          <div className="relative group">
                            <button
                              type="button"
                              disabled
                              className="text-xs text-text-secondary/40 cursor-not-allowed px-2 py-1"
                            >
                              Delete
                            </button>
                            <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block w-48 p-2 bg-surface-elevated border border-border text-[10px] text-text-secondary rounded shadow-lg z-10">
                              Cannot delete: {count} {count === 1 ? 'note is' : 'notes are'} assigned to this department.
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onDeleteDepartment(dept)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            fullWidth={false}
            onClick={onClose}
            className="text-xs px-5"
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
