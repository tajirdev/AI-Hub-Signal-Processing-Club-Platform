import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Label, Input, PasswordInput, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { submitOnboarding, fetchSubgroups } from '../../services/endpoints';
import { LoadingState } from '../../components/ui/States';
import { CheckCircle2, BrainCircuit, Cpu, Sparkles, BookOpen, Code2, Rocket } from 'lucide-react';

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
      <div className="relative min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#071225]">
        <div className="w-full max-w-md relative z-10 px-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] text-center">
            <h2 className="text-[28px] font-heading font-black text-gray-900 dark:text-white tracking-tight mb-4">Invalid Link</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
              Your onboarding link is missing required information (Email or OTP). Please check your approval email and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="relative min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#071225]">
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
          <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-amber/20 dark:bg-amber/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-[30%] w-80 h-80 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-md relative z-10 px-6">
          <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-[28px] font-heading font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Welcome to the Hub!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-8">
              Your member profile has been created successfully. Redirecting you to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#071225]">
      
      {/* Playful Floating Background Elements (Fixed) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-amber/20 dark:bg-amber/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-[30%] w-80 h-80 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000"></div>
        
        <div className="absolute top-[20%] left-[20%] animate-bounce" style={{ animationDuration: '4s' }}>
          <BrainCircuit className="w-10 h-10 text-gray-400/50 dark:text-gray-500/50 rotate-12" />
        </div>
        <div className="absolute top-[30%] right-[20%] animate-bounce" style={{ animationDuration: '5s' }}>
          <Rocket className="w-12 h-12 text-amber/40 dark:text-amber/20 -rotate-12" />
        </div>
        <div className="absolute bottom-[20%] left-[25%] animate-bounce" style={{ animationDuration: '6s' }}>
          <Code2 className="w-8 h-8 text-blue-400/50 dark:text-blue-500/30 -rotate-6" />
        </div>
        <div className="absolute bottom-[15%] right-[25%] animate-bounce" style={{ animationDuration: '4.5s' }}>
          <BookOpen className="w-10 h-10 text-purple-400/40 dark:text-purple-500/30 rotate-12" />
        </div>
        <div className="absolute top-[50%] left-[10%] animate-pulse">
          <Sparkles className="w-6 h-6 text-amber/50" />
        </div>
        <div className="absolute top-[60%] right-[10%] animate-pulse">
          <Cpu className="w-8 h-8 text-gray-400/40" />
        </div>
      </div>

      <div className="w-full max-w-2xl relative z-10 px-6">
        <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          
          <div className="text-center mb-10">
            <h1 className="text-[32px] md:text-[36px] font-heading font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-md mx-auto">
              Your application has been approved! Setup your account and select your technical subgroup to get started.
            </p>
          </div>
  
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
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
                  disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
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
                    className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" >
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
                  disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
                <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm Password *</Label>
                <PasswordInput 
                  id="confirm_password" name="confirm_password" 
                  value={formData.confirm_password} onChange={handleChange} 
                  disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
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
                    disabled={isLoading} className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input 
                    id="linkedin" name="linkedin" 
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin} onChange={handleChange} 
                    disabled={isLoading} className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="portfolio">Personal Website / Portfolio</Label>
              <Input 
                id="portfolio" name="portfolio" type="url"
                placeholder="https://..."
                value={formData.portfolio} onChange={handleChange} 
                disabled={isLoading} className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
            </div>

            <div>
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea 
                id="bio" name="bio" 
                placeholder="Tell the community a bit about yourself, your interests, and your tech stack."
                value={formData.bio} onChange={handleChange} 
                disabled={isLoading} className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
            </div>

            <Button type="submit" className="w-full mt-4 bg-[#FFB347] hover:bg-[#FFA012] text-white shadow-[0_8px_20px_rgba(255,179,71,0.4)] hover:-translate-y-0.5 transition-all rounded-2xl py-4 font-body font-bold text-base normal-case tracking-normal" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Complete Profile & Join'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
