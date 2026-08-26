import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Label, Input, PasswordInput, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { submitOnboarding, fetchSubgroups } from '../../services/endpoints';
import { LoadingState } from '../../components/ui/States';
import { CheckCircle2 } from 'lucide-react';

export function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract auto-filled params from URL
  const emailParam = searchParams.get('email') || '';
  const otpParam = searchParams.get('otp') || '';

  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    confirm_password: '',
    bio: '',
    subgroup_id: '',
    github: '',
    linkedin: '',
    portfolio: ''
  });

  const [subgroups, setSubgroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSubgroups, setIsFetchingSubgroups] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch subgroups for the dropdown
    fetchSubgroups()
      .then(data => setSubgroups(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load subgroups", err))
      .finally(() => setIsFetchingSubgroups(false));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailParam || !otpParam) {
      setError("Invalid onboarding link. Missing email or OTP.");
      return;
    }

    if (!formData.user_name || !formData.password || !formData.subgroup_id) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        email: emailParam,
        otp_code: otpParam,
        password: formData.password,
        user_name: formData.user_name,
        bio: formData.bio || null,
        subgroup_id: parseInt(formData.subgroup_id),
        github: formData.github || null,
        linkedin: formData.linkedin || null,
        portfolio: formData.portfolio || null
      };

      await submitOnboarding(payload);
      setSuccess(true);
      
      // Auto-redirect to login after short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error(err);
      let errMsg = "Failed to complete onboarding. Your OTP might be invalid or expired.";
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

  if (!emailParam || !otpParam) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-[1280px] mx-auto min-h-[60vh] flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-heading font-black text-navy dark:text-white mb-4">Invalid Link</h2>
        <p className="text-gray-500">Your onboarding link is missing required information (Email or OTP). Please check your approval email and try again.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-8 max-w-[1280px] mx-auto min-h-[80vh] flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-navy dark:text-white mb-4">
            Welcome to the Hub!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your member profile has been created successfully. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-8 max-w-[1280px] mx-auto">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-black text-navy dark:text-white mb-4">
            Complete Your Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            Your application has been approved! Setup your account and select your technical subgroup to get started.
          </p>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0a2472]/5 dark:bg-[#ffba08]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          {error && (
            <div className="relative z-10 mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
            
            {/* Hidden fields explicitly handling backend architecture */}
            <input type="hidden" name="email" value={emailParam} />
            <input type="hidden" name="otp_code" value={otpParam} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="user_name">Username *</Label>
                <Input 
                  id="user_name" name="user_name" 
                  placeholder="e.g. johndoe"
                  value={formData.user_name} onChange={handleChange} 
                  disabled={isLoading} required 
                />
              </div>
              
              <div>
                <Label htmlFor="subgroup_id">Technical Subgroup *</Label>
                {isFetchingSubgroups ? (
                  <div className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-surface-darkAlt text-gray-500 animate-pulse text-sm">
                    Loading subgroups...
                  </div>
                ) : (
                  <Select
                    id="subgroup_id" name="subgroup_id"
                    value={formData.subgroup_id} onChange={handleChange}
                    disabled={isLoading} required
                    className="dark:bg-[#0b172a]"
                  >
                    <option value="" disabled>Select your primary track</option>
                    {subgroups.map(sg => (
                      <option key={sg.id} value={sg.id} className="text-gray-900 dark:text-gray-100">{sg.name}</option>
                    ))}
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="password">Password *</Label>
                <PasswordInput 
                  id="password" name="password" 
                  value={formData.password} onChange={handleChange} 
                  disabled={isLoading} required 
                />
                <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm Password *</Label>
                <PasswordInput 
                  id="confirm_password" name="confirm_password" 
                  value={formData.confirm_password} onChange={handleChange} 
                  disabled={isLoading} required 
                />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
              <h3 className="font-heading font-bold text-[#0a2472] dark:text-white mb-4">Social & Links (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="github">GitHub Username</Label>
                  <Input 
                    id="github" name="github" 
                    placeholder="e.g. octocat"
                    value={formData.github} onChange={handleChange} 
                    disabled={isLoading} 
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input 
                    id="linkedin" name="linkedin" 
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin} onChange={handleChange} 
                    disabled={isLoading} 
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="portfolio">Personal Website / Portfolio</Label>
              <Input 
                id="portfolio" name="portfolio" type="url"
                placeholder="https://..."
                value={formData.portfolio} onChange={handleChange} 
                disabled={isLoading} 
              />
            </div>

            <div>
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea 
                id="bio" name="bio" 
                placeholder="Tell the community a bit about yourself, your interests, and your tech stack."
                value={formData.bio} onChange={handleChange} 
                disabled={isLoading}
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Complete Profile & Join'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
