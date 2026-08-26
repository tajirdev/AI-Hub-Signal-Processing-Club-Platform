import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Label, Input, PasswordInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError('');

    const res = await login(formData.email, formData.password);
    
    setIsLoading(false);
    
    if (res.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(res.message || "Failed to log in.");
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-8 max-w-[1280px] mx-auto min-h-[80vh] flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10 text-center mb-10">
          <h1 className="text-3xl font-heading font-black text-navy dark:text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Sign in to access your member dashboard.
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
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="password" className="mb-0">Password</Label>
              <Link to="/forgot-password" className="text-xs font-semibold text-[#0a2472] dark:text-[#ffba08] hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput 
              id="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative z-10 mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Not a member yet?{' '}
          <Link to="/join" className="font-semibold text-[#0a2472] dark:text-[#ffba08] hover:underline">
            Apply to Join
          </Link>
        </div>
      </div>
    </div>
  );
}
