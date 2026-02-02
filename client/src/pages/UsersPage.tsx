import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/redux";
import { Navigate } from "react-router-dom";
import UserTable from "../components/UserTable";
// import {
//   fetchUsers,
//   updateUserRole,
//   toggleUserStatus,
// } from "../user.service";
import type { User } from "../types/types";
import EditUserModal from "../components/modals/EditUserModal";
import { getAllUsers, updateUser } from "../apis/users";
import CreateUserModal from "../components/modals/CreateUserModal";
import { registerUser } from "../apis/auth";
const PAGE_SIZE = 10;
const UsersPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<User[]>([]);

  const [totalUsers, setTotalUsers] = useState(users.length);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(page, PAGE_SIZE);
      setUsers(res.users);
      setTotalUsers(res.total);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleRoleChange = async (userId: string, role: User["role"]) => {
    await updateUser(userId, { role });

    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role } : u)),
    );
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    await updateUser(userId, { isActive });

    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isActive } : u)),
    );
  };

  const handleDeleteUser = async (userId: string) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleEditUser = (userId: string) => {
    // Navigate to edit user page or open modal
    const user = users.find((u) => u._id === userId);
    if (!user) return;
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleUpdateUser = async (payload: {
    role: User["role"];
    isActive: boolean;
    password?: string;
  }) => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      // API calls
      await updateUser(selectedUser._id, payload);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, ...payload } : u,
        ),
      );

      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUserOpen = async () => {
    setCreateOpen(true);
  };

  const handleCreateUser = async (payload: {
    email: string;
    password: string;
    role: User["role"];
  }) => {
    setSaving(true);
    try {
      await registerUser({
        email: payload.email,
        password: payload.password,
        role: payload.role.toLocaleLowerCase(),
      });
      await fetchUsers();
      setCreateOpen(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-gray-500">
            Manage user roles and account status
          </p>
        </div>
        <div>
          <button className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white" onClick={handleCreateUserOpen}>Create</button>
        </div>
      </div>

      <UserTable
        users={users}
        onRoleChange={handleRoleChange}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteUser}
        onEdit={handleEditUser}
        currentPage={page}
        totalItems={totalUsers}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
      <EditUserModal
        open={editOpen}
        user={selectedUser}
        loading={saving}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdateUser}
      />
      <CreateUserModal
        open={createOpen}
        loading={saving}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};

export default UsersPage;
