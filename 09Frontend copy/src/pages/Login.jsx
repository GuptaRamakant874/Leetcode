import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { googleAuthUser, loginUser } from "../authSlice";
import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import GoogleAuthButton from '../components/GoogleAuthButton';

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

const forgotPasswordSchema = z.object({
  emailId: z.string().email('Please enter a valid email')
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordErrors },
    reset: resetForgotPasswordForm,
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const handleGoogleAuth = (credential) => {
    dispatch(googleAuthUser(credential));
  };

  const onForgotPasswordSubmit = async (data) => {
    setForgotPasswordLoading(true);
    setForgotPasswordError('');
    setForgotPasswordMessage('');

    try {
      const response = await axiosClient.post('/user/forgot-password', data);
      setForgotPasswordMessage(response.data?.message || 'Reset link sent successfully');
      resetForgotPasswordForm();
    } catch (requestError) {
      setForgotPasswordError(requestError?.response?.data?.message || 'Unable to generate reset link');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl mb-6">Leetcode</h2>

          {!showForgotPassword && error && (
            <div role="alert" className="alert alert-error mb-4 text-sm">
              <span>{error}</span>
            </div>
          )}

          {showForgotPassword ? (
            <div className="border border-base-300 rounded-xl p-4 bg-base-200/40">
              <h3 className="font-semibold mb-2">Forgot Password</h3>
              <p className="text-sm text-base-content/70 mb-4">
                Enter your email and we will send a password reset link to that inbox.
              </p>

              {forgotPasswordError && (
                <div role="alert" className="alert alert-error mb-4 text-sm">
                  <span>{forgotPasswordError}</span>
                </div>
              )}

              {forgotPasswordMessage && (
                <div role="alert" className="alert alert-success mb-4 text-sm">
                  <span>{forgotPasswordMessage}</span>
                </div>
              )}

              <form onSubmit={handleForgotPasswordSubmit(onForgotPasswordSubmit)}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Registered Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className={`input input-bordered w-full ${forgotPasswordErrors.emailId ? 'input-error' : ''}`}
                    {...registerForgotPassword('emailId')}
                  />
                  {forgotPasswordErrors.emailId && (
                    <span className="text-error text-sm mt-1">{forgotPasswordErrors.emailId.message}</span>
                  )}
                </div>

                <div className="form-control mt-4">
                  <button
                    type="submit"
                    className={`btn btn-outline ${forgotPasswordLoading ? 'loading btn-disabled' : ''}`}
                    disabled={forgotPasswordLoading}
                  >
                    {forgotPasswordLoading ? 'Sending Email...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="link link-primary text-sm"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordError('');
                    setForgotPasswordMessage('');
                  }}
                >
                  Back to Login
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <GoogleAuthButton onCredentialResponse={handleGoogleAuth} disabled={loading} />
              </div>

              <div className="divider text-xs text-base-content/50">OR</div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className={`input input-bordered w-full ${errors.emailId ? 'input-error' : ''}`}
                    {...register('emailId')}
                  />
                  {errors.emailId && (
                    <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
                  )}
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-error text-sm mt-1">{errors.password.message}</span>
                  )}
                </div>

                <div className="mt-3 text-right">
                  <button
                    type="button"
                    className="link link-primary text-sm"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotPasswordError('');
                      setForgotPasswordMessage('');
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="form-control mt-6 flex justify-center">
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? 'loading btn-disabled' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="text-center mt-6">
            <span className="text-sm">
              Don't have an account?{' '}
              <NavLink to="/signup" className="link link-primary">
                Sign Up
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
