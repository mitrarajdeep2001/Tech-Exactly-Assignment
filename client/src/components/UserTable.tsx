import UserRow from "./UserRow";
import type { User } from "../types/types";
import Pagination from "./Pagination";

interface Props {
  users: User[];
  onRoleChange: (userId: string, role: User["role"]) => void;
  onToggleStatus: (userId: string, isActive: boolean) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const UserTable = ({
  users,
  onRoleChange,
  onToggleStatus,
  onEdit,
  onDelete,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: Props) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-900 border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-50 dark:bg-zinc-800 text-xs uppercase">
          <tr>
            <th className="px-4 py-3">Username</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              user={user}
              onRoleChange={onRoleChange}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default UserTable;
