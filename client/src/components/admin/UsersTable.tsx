import React, { useState } from 'react';
import { AdminUser } from '../../types/admin.types';

export interface UsersTableProps {
  users: AdminUser[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  // Pagination stub structure for future extension
  const [currentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-base font-semibold text-text-primary">
          User Accounts ({users.length})
        </h2>
        <span className="text-xs text-text-secondary">
          Showing {paginatedUsers.length} of {users.length} registered users
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-text-primary">
          <thead className="bg-surface-elevated text-[11px] font-semibold uppercase tracking-wider text-text-secondary border-b border-border">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Joined Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-surface-elevated/60 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-text-secondary whitespace-nowrap font-mono text-xs">
                  {user.joinedDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls footer stub */}
      <div className="px-6 py-3 border-t border-border bg-surface-elevated/40 flex items-center justify-between text-xs text-text-secondary">
        <span>Page 1 of 1</span>
        <div className="flex gap-2">
          <button
            disabled
            className="px-2.5 py-1 rounded bg-surface border border-border opacity-40 cursor-not-allowed"
          >
            Prev
          </button>
          <button
            disabled
            className="px-2.5 py-1 rounded bg-surface border border-border opacity-40 cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
