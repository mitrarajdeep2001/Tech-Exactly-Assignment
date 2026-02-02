import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { User } from "../../types/types";
import FieldError from "../FieldError";
import PasswordStrength from "../PasswordStrength";

interface Props {
  open: boolean;
  user: User | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    role: User["role"];
    isActive: boolean;
    password?: string;
  }) => void;
}

interface FormData {
  role: User["role"];
  isActive: boolean;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

const EditUserModal = ({ open, user, loading, onClose, onSubmit }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    role: "USER",
    isActive: true,
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role,
        isActive: user.isActive,
        password: "",
        confirmPassword: "",
      });
      setFormErrors({});
    }
  }, [user]);

  if (!open || !user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      } else if (!formData.password.match(/[a-z]/)) {
        errors.password = "Password must contain at least one lowercase letter";
      } else if (!formData.password.match(/[A-Z]/)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!formData.password.match(/[0-9]/)) {
        errors.password = "Password must contain at least one number";
      } else if (!formData.password.match(/[^A-Za-z0-9]/)) {
        errors.password =
          "Password must contain at least one special character";
      }
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      role: formData.role,
      isActive: formData.isActive,
      ...(formData.password && { password: formData.password }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-gray-100 dark:bg-zinc-800"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              value={user.username}
              disabled
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-gray-100 dark:bg-zinc-800"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role.toLocaleUpperCase()}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-zinc-900"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <input
                type={togglePassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Leave blank to keep unchanged"
                className="w-full mt-1 px-3 py-2 pr-10 border rounded-md text-sm"
              />
              <button
                type="button"
                onClick={() => setTogglePassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {togglePassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <FieldError message={formErrors.password} />
            <PasswordStrength password={formData.password} visible={focused} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={toggleConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              />
              <button
                type="button"
                onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {toggleConfirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
            <FieldError message={formErrors.confirmPassword} />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Account Status</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={() =>
                  setFormData((p) => ({ ...p, isActive: !p.isActive }))
                }
                className="sr-only peer"
              />
              <span className="slider" style={{zoom: "0.7"}} />
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
