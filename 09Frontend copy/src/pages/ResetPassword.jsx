import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NavLink, useNavigate, useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async ({ password }) => {
    setSubmitting(true);
    setServerError('');
    setServerMessage('');

    try {
      const { data } = await axiosClient.post(`/user/reset-password/${token}`, { password });
      setServerMessage(data?.message || 'Password reset successfully');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setServerError(error?.response?.data?.message || 'Unable to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-2">Reset Password</h2>
          <p className="text-sm text-base-content/70 text-center mb-4">
            Enter your new password to finish resetting your account.
          </p>

          {serverError && (
            <div role="alert" className="alert alert-error mb-4 text-sm">
              <span>{serverError}</span>
            </div>
          )}

          {serverMessage && (
            <div role="alert" className="alert alert-success mb-4 text-sm">
              <span>{serverMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter new password"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`input input-bordered w-full pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm new password"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>
              )}
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn btn-primary ${submitting ? 'loading btn-disabled' : ''}`}
                disabled={submitting}
              >
                {submitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 text-sm">
            <NavLink to="/login" className="link link-primary">
              Back to Login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
