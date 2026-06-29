import { useState } from "react";
import loginBg from "../assets/login-bg-1.svg";
import logo from "../assets/logo.svg";
import { API_BASE } from "../services/api";

function EyeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      {...props}
    >
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      {...props}
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c7 0 10.5 7 10.5 7a13.2 13.2 0 0 1-2.6 3.4M6.5 6.6C3.7 8.4 1.5 12 1.5 12s3.5 7 10.5 7c1.4 0 2.7-.3 3.9-.7" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export default function ResetPasswordPage({ token, onBackToLogin }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    setFormError("");

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Something went wrong.");
        return;
      }

      setSuccessMsg(data.message);
      setSuccess(true);
    } catch {
      setFormError("Could not reach the server. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-100">

      {/* Top curved background */}
      <div
        className="absolute top-0 left-0 w-full h-[260px] sm:h-[320px] md:h-[380px] overflow-hidden rounded-bl-[5rem]"
        aria-hidden="true"
      >
        <img
          src={loginBg}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover object-top"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center pt-10 sm:pt-12 md:pt-14 pb-6 sm:pb-0 min-h-screen">
        <img src={logo} alt="" className="mb-3 h-16 sm:h-16 md:h-16 w-auto" />
        <p className="mb-7 text-base sm:text-lg font-medium tracking-wide text-white text-center">
          Online Project Management
        </p>

        <div className="w-full max-w-sm bg-white px-6 pt-7 pb-8 rounded-2xl my-auto sm:my-0">

          {!success ? (
            <>
              <h1 className="mb-2 text-lg sm:text-xl font-semibold text-slate-800">
                Reset your password
              </h1>
              <p className="mb-6 text-sm text-slate-500">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                {/* New Password */}
                <div className="mb-5">
                  <label htmlFor="new-password" className="mb-2 block text-sm text-slate-500">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "new-password-error" : undefined}
                      className={`w-full rounded-md border px-3 py-3 sm:py-2.5 pr-10 text-base sm:text-sm outline-none transition-colors ${
                        errors.password
                          ? "border-red-400 bg-sky-50 ring-1 ring-red-300"
                          : "border-slate-300 bg-white focus:border-sky-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="new-password-error" className="mt-1 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-2">
                  <label htmlFor="confirm-password" className="mb-2 block text-sm text-slate-500">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                      className={`w-full rounded-md border px-3 py-3 sm:py-2.5 pr-10 text-base sm:text-sm outline-none transition-colors ${
                        errors.confirmPassword
                          ? "border-red-400 bg-sky-50 ring-1 ring-red-300"
                          : "border-slate-300 bg-white focus:border-sky-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p id="confirm-password-error" className="mt-1 text-xs text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {formError && (
                  <p className="mt-2 text-center text-sm text-red-500">{formError}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-full bg-blue-900 py-3 sm:py-2.5 text-base sm:text-sm font-medium text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
                >
                  {loading ? "Resetting…" : "Reset Password"}
                </button>
              </form>

              <button
                onClick={onBackToLogin}
                className="mt-3 w-full text-center text-sm text-sky-600 hover:underline"
              >
                ← Back to Login
              </button>
            </>
          ) : (
            /* Success state */
            <>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-1 text-lg font-semibold text-slate-800">Password reset!</h2>
              <p className="mb-5 text-sm text-slate-500">{successMsg}</p>
              <button
                onClick={onBackToLogin}
                className="w-full rounded-full bg-blue-900 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
