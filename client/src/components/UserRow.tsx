import { TrashIcon, PencilIcon, ShieldIcon, UserIcon } from "lucide-react";
import type { User } from "../types/types";
import formatDateTime from "../lib/formatDateTime";

interface Props {
  user: User;
  onRoleChange: (userId: string, role: User["role"]) => void;
  onToggleStatus: (userId: string, isActive: boolean) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

const UserRow = ({
  user,
  onRoleChange,
  onToggleStatus,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <tr className="border-b last:border-b-0 dark:border-zinc-800 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition">
      {/* Username */}
      <td className="px-4 py-3 font-medium text-gray-800 dark:text-zinc-100">
        {user.username}
      </td>

      {/* Email */}
      <td className="px-4 py-3 font-medium text-gray-800 dark:text-zinc-100">
        {user.email}
      </td>

      {/* Role */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {user.role === "ADMIN" ? (
            <ShieldIcon size={14} className="text-purple-600" />
          ) : (
            <UserIcon size={14} className="text-gray-500" />
          )}

          <select
            value={user.role.toLocaleUpperCase()}
            onChange={(e) =>
              onRoleChange(user._id, e.target.value as User["role"])
            }
            className="border rounded px-2 py-1 text-xs bg-white dark:bg-zinc-900 dark:border-zinc-700"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </td>

      {/* Status */}
      {/* Toggle */}
      {/* <td className="px-4 py-3">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={user.isActive}
            onChange={() => onToggleStatus(user._id, !user.isActive)}
            className="sr-only peer"
          />

          <div
            className="
        relative w-11 h-6 rounded-full
        bg-gray-300 dark:bg-zinc-700
        peer-checked:bg-green-500
        transition-colors duration-200
      "
          >
            <span
              className="
          absolute left-0.5 top-0.5
          h-5 w-5 rounded-full
          bg-white
          transform transition-transform duration-200
          peer-checked:translate-x-5
        "
            />
          </div>
        </label>
      </td> */}
      <td className="px-4 py-3">
        <label className="switch">
          <input
            type="checkbox"
            checked={user.isActive}
            onChange={() => onToggleStatus(user._id, !user.isActive)}
          />
          <span className="slider" />
        </label>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(user._id)}
            title="Edit user"
            className="text-blue-600 hover:text-blue-700"
          >
            <PencilIcon size={16} />
          </button>

          <button
            title="Delete user"
            onClick={() => onDelete(user._id)}
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      </td>

      {/* Joined */}
      <td className="px-4 py-3 text-gray-500 dark:text-zinc-400">
        {formatDateTime(user.createdAt)}
      </td>
    </tr>
  );
};

export default UserRow;
