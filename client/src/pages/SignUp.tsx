import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import GoogleButton from "../components/GoogleButton";
import PasswordStrength from "../components/PasswordStrength";
import { useState } from "react";
import FieldError from "../components/FieldError";
import { Eye, EyeOff } from "lucide-react";
import type { FormErrors, FormData } from "../types/types";
import {
  handleFacebookLogin,
  handleGoogleLogin,
  registerUser,
} from "../apis/auth";
import toast from "react-hot-toast";
import FacebookButton from "../components/FacebookButton";

const SignUp = () => {
  const navigate = useNavigate(); // Placeholder for navigation function
  const [serverError, setServerError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focused, setFocused] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);

  // const NAME_REGEX = /^[a-zA-Z][a-zA-Z\s'-]{1,48}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};

    // Full Name
    // if (!formData?.fullName?.trim()) {
    //   errors.fullName = "Full name is required";
    // } else if (!NAME_REGEX.test(formData?.fullName?.trim())) {
    //   errors.fullName = "Enter a valid full name";
    // }

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

    // Confirm Password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "confirmPassword") {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword:
          value && value !== formData.password ? "Passwords do not match" : "",
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validationErrors = validateForm(formData);
      setFormErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return; // stop submission
      }

      // ✅ Form is valid — proceed with API call
      await registerUser({
        email: formData.email,
        password: formData.password,
        role: "user",
      });
      toast.success("Registration successful! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error?.response?.data?.code === "ValidationError") {
        setServerError("");
        setFormErrors({
          ...formErrors,
          email: error?.response?.data?.errors?.email?.msg || "",
          password: error?.response?.data.errors?.password?.msg || "",
        });
      } else {
        setFormErrors({});
        setServerError(
          error.response.data.message ||
            "Registration failed. Please try again.",
        );
      }
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Get started with Bloggy.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>
          <label className="text-sm font-medium text-slate-700">
            Full name <small className="text-red-600">*</small>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full rounded-lg border px-3 py-2 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
      ${
        formErrors.fullName
          ? "border-red-300 focus:ring-red-500"
          : "border-slate-300"
      }
    `}
          />
          <FieldError message={formErrors.fullName} />
        </div> */}

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
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
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
          <PasswordStrength password={formData.password} visible={focused} />
          <FieldError message={formErrors.password} />
        </div>
        <div className="relative">
          <label className="text-sm font-medium text-slate-700">
            Confirm Password <small className="text-red-600">*</small>
          </label>

          <div className="relative">
            <input
              type={toggleConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full rounded-lg border px-3 py-2 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
      ${
        formErrors.confirmPassword
          ? "border-red-300 focus:ring-red-500"
          : "border-slate-300"
      }
    `}
            />

            {formData?.confirmPassword &&
              formData.confirmPassword.length > 0 && (
                <span
                  className={`absolute right-10 top-1/2 -translate-y-1/2  uppercase rounded-full px-3 py-0.5 text-xs font-semibold text-white
        ${!formErrors.confirmPassword ? "bg-green-500" : "bg-red-500"}
      `}
                >
                  {formErrors.confirmPassword ? "Not Matched" : "Matched"}
                </span>
              )}
            <button
              type="button"
              onClick={() => setToggleConfirmPassword(!toggleConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {toggleConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <FieldError message={formErrors.confirmPassword} />
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
          Create Account
        </button>
      </form>

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
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
