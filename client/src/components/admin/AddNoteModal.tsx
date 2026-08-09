import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { AddNoteFormState, AddNoteFormErrors, Note } from '../../types/note.types';
import { uploadNote } from '../../data/mockData';

export interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingDepartments?: string[];
  onNoteAdded: (note: Note) => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  existingDepartments = [
    'Computer Science',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Civil Engineering',
  ],
  onNoteAdded,
}) => {
  const [formState, setFormState] = useState<AddNoteFormState>({
    title: '',
    department: existingDepartments[0] || 'Computer Science',
    tags: '',
    file: null,
  });

  const [isCustomDept, setIsCustomDept] = useState<boolean>(false);
  const [customDepartment, setCustomDepartment] = useState<string>('');

  const [errors, setErrors] = useState<AddNoteFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleInputChange = (field: keyof AddNoteFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handleDeptSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__NEW__') {
      setIsCustomDept(true);
      setFormState((prev) => ({ ...prev, department: customDepartment }));
    } else {
      setIsCustomDept(false);
      setFormState((prev) => ({ ...prev, department: val }));
    }
    if (errors.department) {
      setErrors((prev) => ({ ...prev, department: undefined }));
    }
  };

  const handleCustomDeptChange = (val: string) => {
    setCustomDepartment(val);
    setFormState((prev) => ({ ...prev, department: val }));
    if (errors.department) {
      setErrors((prev) => ({ ...prev, department: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const isPdfExtension = selectedFile.name.toLowerCase().endsWith('.pdf');
      const isPdfMime = selectedFile.type === 'application/pdf';

      if (!isPdfExtension && !isPdfMime) {
        setErrors((prev) => ({
          ...prev,
          file: 'Only PDF files (.pdf) are allowed',
        }));
        setFormState((prev) => ({ ...prev, file: null }));
        return;
      }
    }

    setFormState((prev) => ({ ...prev, file: selectedFile }));
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: AddNoteFormErrors = {};

    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    }

    const deptVal = isCustomDept ? customDepartment.trim() : formState.department.trim();
    if (!deptVal) {
      newErrors.department = 'Department is required';
    }

    if (!formState.file) {
      newErrors.file = 'PDF file is required';
    } else {
      const isPdfExtension = formState.file.name.toLowerCase().endsWith('.pdf');
      const isPdfMime = formState.file.type === 'application/pdf';
      if (!isPdfExtension && !isPdfMime) {
        newErrors.file = 'Only PDF files (.pdf) are allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!formState.file) return;

    const finalDept = isCustomDept ? customDepartment.trim() : formState.department.trim();

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await uploadNote({
        title: formState.title,
        department: finalDept,
        tags: formState.tags,
        file: formState.file,
      });

      if (response.success && response.note) {
        onNoteAdded(response.note);
        // Reset form
        setFormState({
          title: '',
          department: existingDepartments[0] || 'Computer Science',
          tags: '',
          file: null,
        });
        setIsCustomDept(false);
        setCustomDepartment('');
        onClose();
      } else {
        setApiError(response.message || 'Failed to upload note');
      }
    } catch (err) {
      setApiError('An unexpected error occurred during upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish New Note">
      <form onSubmit={handleSubmit} className="p-7 space-y-4 animate-form-fade-in">
        {apiError && (
          <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-xs">
            {apiError}
          </div>
        )}

        {/* Note Title Input */}
        <Input
          id="note-title"
          label="Note Title *"
          placeholder="e.g. Data Structures & Algorithms Notes"
          value={formState.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={errors.title}
        />

        {/* Department Select / Custom Input */}
        <div className="w-full flex flex-col gap-1">
          <label
            htmlFor="note-department"
            className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary select-none"
          >
            Department *
          </label>
          <div className="relative">
            <select
              id="note-department"
              value={isCustomDept ? '__NEW__' : formState.department}
              onChange={handleDeptSelectChange}
              className={`w-full px-4 py-3 rounded-lg bg-surface text-text-primary border transition-all duration-150 text-sm ${
                errors.department
                  ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
                  : 'border-border focus:border-primary focus:shadow-glow-primary'
              } focus:outline-none`}
            >
              {existingDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
              <option value="__NEW__">+ Add new department...</option>
            </select>
          </div>

          {/* If '+ Add new department' selected, show text input */}
          {isCustomDept && (
            <div className="mt-2 animate-form-fade-in">
              <Input
                id="custom-department-input"
                label="New Department Name *"
                placeholder="e.g. Aerospace Engineering"
                value={customDepartment}
                onChange={(e) => handleCustomDeptChange(e.target.value)}
              />
            </div>
          )}

          {errors.department && (
            <p className="text-xs text-error font-medium mt-0.5">
              {errors.department}
            </p>
          )}
        </div>

        {/* Tags Optional Input */}
        <Input
          id="note-tags"
          label="Tags (Optional)"
          placeholder="e.g. Arrays, Trees, Sorting (comma-separated)"
          value={formState.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          helperText="Separate tags with commas"
        />

        {/* PDF File Upload Input */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary select-none">
            PDF File * (.pdf only)
          </label>
          <div
            className={`w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-150 bg-surface ${
              errors.file
                ? 'border-error/80 bg-error/5'
                : formState.file
                ? 'border-primary/80 bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-surface-elevated'
            }`}
          >
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer block w-full">
              {formState.file ? (
                <div className="flex items-center justify-center gap-2 text-primary text-sm font-semibold">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate max-w-[260px]">{formState.file.name}</span>
                  <span className="text-xs text-text-secondary font-mono">
                    ({(formState.file.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-text-secondary py-1">
                  <svg className="w-7 h-7 text-primary/70 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium text-text-primary">
                    Click to select PDF document
                  </span>
                  <span className="text-xs text-text-secondary/70">
                    Supports .pdf format up to 25MB
                  </span>
                </div>
              )}
            </label>
          </div>
          {errors.file && (
            <p className="text-xs text-error font-medium mt-0.5">
              {errors.file}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth={false}
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth={false}
            isLoading={isSubmitting}
            className="text-xs px-5 font-semibold"
          >
            Publish
          </Button>
        </div>
      </form>
    </Modal>
  );
};

