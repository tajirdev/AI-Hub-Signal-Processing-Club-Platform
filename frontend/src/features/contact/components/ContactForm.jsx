import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Label, Input, Textarea } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';
import { submitContact } from '../../../services/endpoints';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    
    try {
      await submitContact(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <ScrollReveal animation="scale-up" delay={0}>
        <div className="bg-white dark:bg-[#0b172a] p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[500px]">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-navy dark:text-white mb-4 font-heading">Message Sent!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            Thank you for reaching out. We have received your message and our team will get back to you shortly.
          </p>
          <Button 
            onClick={() => setStatus('idle')}
            className="bg-navy hover:bg-navy-soft text-white dark:bg-amber dark:hover:bg-amber/90 dark:text-navy rounded-2xl py-6 px-8 font-bold"
          >
            Send Another Message
          </Button>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal animation="fade-up" delay={200}>
      <div className="bg-white dark:bg-[#0b172a] p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden h-full">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <h3 className="text-3xl font-black text-navy dark:text-white mb-8 font-heading">Send a Message</h3>
        
        {status === 'error' && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>Please fill out all required fields.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" name="name" 
                value={formData.name} onChange={handleChange} 
                disabled={status === 'submitting'} 
                required 
                className="!bg-[#F5F6F8] dark:!bg-surface-dark border-transparent focus:!border-blue-500 shadow-inner rounded-2xl py-3.5" 
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" name="email" type="email"
                value={formData.email} onChange={handleChange} 
                disabled={status === 'submitting'} 
                required 
                className="!bg-[#F5F6F8] dark:!bg-surface-dark border-transparent focus:!border-blue-500 shadow-inner rounded-2xl py-3.5" 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" name="subject" 
              placeholder="How can we help you?"
              value={formData.subject} onChange={handleChange} 
              disabled={status === 'submitting'} 
              className="!bg-[#F5F6F8] dark:!bg-surface-dark border-transparent focus:!border-blue-500 shadow-inner rounded-2xl py-3.5" 
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea 
              id="message" name="message" 
              placeholder="Write your message here..."
              rows={5}
              value={formData.message} onChange={handleChange} 
              disabled={status === 'submitting'} 
              required
              className="!bg-[#F5F6F8] dark:!bg-surface-dark border-transparent focus:!border-blue-500 shadow-inner rounded-2xl py-3.5 resize-none" 
            />
          </div>

          <Button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-amber dark:hover:bg-amber/90 dark:text-navy shadow-lg hover:-translate-y-0.5 transition-all rounded-2xl py-6 font-bold text-base"
          >
            {status === 'submitting' ? 'Sending Message...' : (
              <span className="flex items-center justify-center gap-2">
                Send Message <Send className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </ScrollReveal>
  );
}
