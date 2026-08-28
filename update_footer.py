import re

filepath = 'frontend/src/components/layout/Footer.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Add imports
text = text.replace("import { Link } from 'react-router-dom';", "import { useState } from 'react';\nimport { Link } from 'react-router-dom';\nimport { subscribeNewsletter } from '../../services/endpoints';")

# Replace function signature and add state
text = text.replace('export function Footer() {', """export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const res = await subscribeNewsletter(email);
      setMessage(res.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };""")

# Replace the form
old_form = """              <div className="mt-4">
                <h4 className="font-heading font-bold text-sm tracking-wider uppercase mb-3 text-amber">Stay Updated</h4>
                <form className="flex" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="bg-white/10 border border-white/20 rounded-l-lg px-4 py-3 text-sm outline-none focus:border-amber w-full text-white placeholder:text-white/40"
                  />
                  <button type="submit" className="bg-amber hover:bg-amber-hover text-navy px-4 rounded-r-lg transition-colors flex items-center justify-center">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>"""

new_form = """              <div className="mt-4">
                <h4 className="font-heading font-bold text-sm tracking-wider uppercase mb-3 text-amber">Stay Updated</h4>
                {message ? (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm font-medium">
                    {message}
                  </div>
                ) : (
                  <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
                    <div className="flex">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address" 
                        required
                        disabled={loading}
                        className="bg-white/10 border border-white/20 rounded-l-lg px-4 py-3 text-sm outline-none focus:border-amber w-full text-white placeholder:text-white/40 disabled:opacity-50"
                      />
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-amber hover:bg-amber-hover disabled:bg-amber/50 disabled:cursor-not-allowed text-navy px-4 rounded-r-lg transition-colors flex items-center justify-center"
                      >
                        {loading ? <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                      </button>
                    </div>
                    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                  </form>
                )}
              </div>"""

text = text.replace(old_form, new_form)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

