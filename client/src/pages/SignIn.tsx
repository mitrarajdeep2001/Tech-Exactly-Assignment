import { Link, useNavigate, useSearchParams } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import AuthLayout from "../layouts/AuthLayout";
import type { FormData, FormErrors } from "../types/types";
import { useState } from "react";
import FieldError from "../components/FieldError";
import { Eye, EyeOff } from "lucide-react";
import {
  handleFacebookLogin,
  handleGoogleLogin,
  loginUser,
} from "../apis/auth";
import { useAppDispatch } from "../hooks/redux";
import { loginSuccess } from "../redux/slices/authSlice";
import FacebookButton from "../components/FacebookButton";

const SignIn = () => {
  const navigate = useNavigate(); // Placeholder for navigation function
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    // Email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    // Password
    if (!formData.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // stop submission
    }

    try {
      // ✅ Form is valid — proceed with API call
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      if (res.status === 200) {
        dispatch(
          loginSuccess({
            user: res.data.user,
            accessToken: res.data.accessToken,
          }),
        );
        navigate("/"); // Redirect to home or dashboard after successful login
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 404 || error.response.status === 400) {
        setServerError(error.response.data.message);
        return;
      }
      setServerError(error.response.data.errors.password.msg);
    }
  };
  return (
    <AuthLayout
      title="Sign in to Bloggy"
      subtitle="Please enter your credentials."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Email address <small className="text-red-600">*</small>
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className={`w-full rounded-lg border px-3 py-2 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
      ${
        formErrors.email
          ? "border-red-300 focus:ring-red-500"
          : "border-slate-300"
      }
    `}
          />
          <FieldError message={formErrors.email} />
        </div>

        {/* Password Field with Tooltip */}
        <div className="relative">
          <label className="text-sm font-medium text-slate-700">
            Password <small className="text-red-600">*</small>
          </label>
          <div className="relative">
            <input
              type={togglePassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full rounded-lg border px-3 py-2 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
      ${
        formErrors.password
          ? "border-red-300 focus:ring-red-500"
          : "border-slate-300"
      }
    `}
            />

            <button
              type="button"
              onClick={() => setTogglePassword(!togglePassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {togglePassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <FieldError message={formErrors.password} />
        </div>

        {serverError && (
          <div className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white text-center border border-red-600">
            {serverError}
          </div>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>

      {searchParams.get("isAdmin") !== "true" && (
        <>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="flex gap-3">
            <GoogleButton label="" onClick={handleGoogleLogin} />

            <FacebookButton label="" onClick={handleFacebookLogin} />
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium">
              Sign up
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default SignIn;
