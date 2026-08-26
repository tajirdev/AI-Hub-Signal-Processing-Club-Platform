import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Label, Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { submitApplication } from '../../services/endpoints';
import { CheckCircle2, BrainCircuit, Cpu, Sparkles, BookOpen, Code2, Rocket } from 'lucide-react';

export function JoinPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    registration_number: '',
    programme: '',
    year: '',
    email: '',
    phone: '',
    motivation: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.registration_number || !formData.programme || !formData.year || !formData.email || !formData.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isNaN(parseInt(formData.registration_number))) {
      setError("Registration number must be numeric.");
      return;
    }
    if (isNaN(parseInt(formData.year))) {
      setError("Year must be a valid number.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        registration_number: parseInt(formData.registration_number),
        year: parseInt(formData.year),
      };
      
      await submitApplication(payload);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      let errMsg = "Failed to submit application. Please try again.";
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errMsg = "Please check your information for validity.";
        } else {
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
              Application Submitted
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-8">
              Thank you for applying to the AI & Signal Processing Hub. Our team will review your application and send you an email with the next steps soon.
            </p>
            <Button asChild className="w-full bg-[#FFB347] hover:bg-[#FFA012] text-white shadow-[0_8px_20px_rgba(255,179,71,0.4)] hover:-translate-y-0.5 transition-all rounded-2xl py-4 font-body font-bold text-base normal-case tracking-normal">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#071225]">
      
      {/* Playful Floating Background Elements & Inspiration Words (Fixed) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-amber/20 dark:bg-amber/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-[30%] w-80 h-80 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-[10%] left-[25%] animate-bounce" style={{ animationDuration: '4s' }}>
          <BrainCircuit className="w-10 h-10 text-gray-400/50 dark:text-gray-500/50 rotate-12" />
        </div>
        <div className="absolute top-[30%] right-[20%] animate-bounce" style={{ animationDuration: '5s' }}>
          <Rocket className="w-12 h-12 text-amber/40 dark:text-amber/20 -rotate-12" />
        </div>
        <div className="absolute bottom-[20%] left-[15%] animate-bounce" style={{ animationDuration: '6s' }}>
          <Code2 className="w-8 h-8 text-blue-400/50 dark:text-blue-500/30 -rotate-6" />
        </div>
        <div className="absolute bottom-[25%] right-[25%] animate-bounce" style={{ animationDuration: '4.5s' }}>
          <BookOpen className="w-10 h-10 text-purple-400/40 dark:text-purple-500/30 rotate-12" />
        </div>
        
        {/* Inspiration Words */}
        <div className="absolute top-[20%] left-[10%] animate-pulse text-2xl font-black text-gray-300/30 dark:text-gray-600/30 -rotate-12">INNOVATE</div>
        <div className="absolute top-[45%] left-[5%] animate-bounce text-xl font-black text-purple-300/30 dark:text-purple-600/30 rotate-12" style={{ animationDuration: '5s' }}>CREATE</div>
        <div className="absolute bottom-[35%] right-[5%] animate-pulse text-2xl font-black text-amber/20 dark:text-amber/20 rotate-6">FUTURE</div>
        <div className="absolute top-[15%] right-[10%] animate-bounce text-3xl font-black text-blue-300/30 dark:text-blue-600/30 -rotate-6" style={{ animationDuration: '7s' }}>AI</div>
        <div className="absolute bottom-[10%] left-[30%] animate-pulse text-xl font-black text-green-300/30 dark:text-green-600/30 rotate-12">SIGNAL PROCESSING</div>

        <div className="absolute top-[50%] left-[20%] animate-pulse">
          <Sparkles className="w-6 h-6 text-amber/50" />
        </div>
        <div className="absolute top-[70%] right-[15%] animate-pulse">
          <Cpu className="w-8 h-8 text-gray-400/40" />
        </div>
      </div>

      <div className="w-full max-w-2xl relative z-10 px-6">
        <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          
          <div className="text-center mb-10">
            <h1 className="text-[32px] md:text-[36px] font-heading font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Apply to Join
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-md mx-auto">
              Submit your application to become a member of the MUST AI & Signal Processing Hub.
            </p>
          </div>
  
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input 
                  id="first_name" name="first_name" 
                  value={formData.first_name} onChange={handleChange} 
                  disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input 
                  id="last_name" name="last_name" 
                  value={formData.last_name} onChange={handleChange} 
                  disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">University Email *</Label>
                <Input 
                  id="email" name="email" type="email"
                  value={formData.email} onChange={handleChange} 
                  disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" name="phone" type="tel"
                  value={formData.phone} onChange={handleChange} 
                  disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="registration_number">Registration Number (Numeric) *</Label>
                <Input 
                  id="registration_number" name="registration_number" type="number"
                  placeholder="e.g. 20230123"
                  value={formData.registration_number} onChange={handleChange} 
                  disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
                <p className="text-xs text-gray-400 mt-1">Must be numeric only per system requirements.</p>
              </div>
              <div>
                <Label htmlFor="year">Year of Study *</Label>
                <Input 
                  id="year" name="year" type="number" min="1" max="5"
                  placeholder="e.g. 2"
                  value={formData.year} onChange={handleChange} 
                  disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="programme">Programme / Degree *</Label>
              <Input 
                id="programme" name="programme" 
                placeholder="e.g. BSc Computer Engineering"
                value={formData.programme} onChange={handleChange} 
                disabled={isLoading} required className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
            </div>

            <div>
              <Label htmlFor="motivation">Motivation (Optional)</Label>
              <Textarea 
                id="motivation" name="motivation" 
                placeholder="Why do you want to join the AI & Signal Processing Hub?"
                value={formData.motivation} onChange={handleChange} 
                disabled={isLoading} className="!bg-[#F5F6F8] dark:!bg-white/5 border-transparent focus:!border-amber shadow-inner rounded-2xl py-3.5 placeholder:text-gray-400" />
            </div>

            <Button type="submit" className="w-full mt-4 bg-[#FFB347] hover:bg-[#FFA012] text-white shadow-[0_8px_20px_rgba(255,179,71,0.4)] hover:-translate-y-0.5 transition-all rounded-2xl py-4 font-body font-bold text-base normal-case tracking-normal" disabled={isLoading}>
              {isLoading ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
