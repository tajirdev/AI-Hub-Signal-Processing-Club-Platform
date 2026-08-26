import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Label, Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { submitApplication } from '../../services/endpoints';
import { CheckCircle2 } from 'lucide-react';

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
    
    // Basic validation
    if (!formData.first_name || !formData.last_name || !formData.registration_number || 
        !formData.programme || !formData.year || !formData.email || !formData.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    // Explicit numeric validation due to backend schema restrictions
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
        // Handle FastAPI validation errors (usually array of dicts)
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
      <div className="pt-32 pb-24 px-6 md:px-8 max-w-[1280px] mx-auto min-h-[80vh] flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-navy dark:text-white mb-4">
            Application Submitted
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Thank you for applying to the AI & Signal Processing Hub. Our team will review your application and send you an email with the next steps soon.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-8 max-w-[1280px] mx-auto">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-black text-navy dark:text-white mb-4">
            Apply to Join
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            Submit your application to become a member of the MUST AI & Signal Processing Hub.
          </p>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-xl">
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
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
                  disabled={isLoading} required 
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input 
                  id="last_name" name="last_name" 
                  value={formData.last_name} onChange={handleChange} 
                  disabled={isLoading} required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">University Email *</Label>
                <Input 
                  id="email" name="email" type="email"
                  value={formData.email} onChange={handleChange} 
                  disabled={isLoading} required 
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" name="phone" type="tel"
                  value={formData.phone} onChange={handleChange} 
                  disabled={isLoading} required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="registration_number">Registration Number (Numeric) *</Label>
                <Input 
                  id="registration_number" name="registration_number" type="number"
                  placeholder="e.g. 20230123"
                  value={formData.registration_number} onChange={handleChange} 
                  disabled={isLoading} required 
                />
                <p className="text-xs text-gray-400 mt-1">Must be numeric only per system requirements.</p>
              </div>
              <div>
                <Label htmlFor="year">Year of Study *</Label>
                <Input 
                  id="year" name="year" type="number" min="1" max="5"
                  placeholder="e.g. 2"
                  value={formData.year} onChange={handleChange} 
                  disabled={isLoading} required 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="programme">Programme / Degree *</Label>
              <Input 
                id="programme" name="programme" 
                placeholder="e.g. BSc Computer Engineering"
                value={formData.programme} onChange={handleChange} 
                disabled={isLoading} required 
              />
            </div>

            <div>
              <Label htmlFor="motivation">Motivation (Optional)</Label>
              <Textarea 
                id="motivation" name="motivation" 
                placeholder="Why do you want to join the AI & Signal Processing Hub?"
                value={formData.motivation} onChange={handleChange} 
                disabled={isLoading}
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
