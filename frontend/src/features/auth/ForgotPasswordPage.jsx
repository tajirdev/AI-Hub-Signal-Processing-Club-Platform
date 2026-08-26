import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Label, Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { requestPasswordReset } from '../../services/endpoints';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      let errMsg = "Failed to send reset link. Please verify your email exists.";
      if (err.response?.data?.detail) {
        if (!Array.isArray(err.response.data.detail)) {
          errMsg = err.response.data.detail;
        }
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-8 max-w-[1280px] mx-auto min-h-[80vh] flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-navy dark:text-white mb-4">
            Check Your Email
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            We've sent a password reset OTP to <strong>{email}</strong>. Please check your inbox and follow the link to create a new password.
          </p>
          <Button onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)} size="lg" className="w-full">
            Continue to Reset
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-8 max-w-[1280px] mx-auto min-h-[80vh] flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="relative z-10 mb-8">
          <h1 className="text-2xl font-heading font-black text-navy dark:text-white mb-3">
            Reset Password
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Enter the email address associated with your account and we'll send you an OTP to reset your password.
          </p>
        </div>

        {error && (
          <div className="relative z-10 mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              disabled={isLoading}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? 'Sending OTP...' : 'Send Reset OTP'}
          </Button>
        </form>
      </div>
    </div>
  );
}
