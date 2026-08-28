import { useState, useEffect } from 'react';
import { getNewsletterSubscribers } from '../../../services/endpoints';
import { Mail, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function NewsletterAdminTab() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getNewsletterSubscribers();
        setSubscribers(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load subscribers.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 h-64">
      <Loader2 className="w-8 h-8 text-amber animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Loading subscribers...</p>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl border border-red-100 dark:border-red-500/20">
      {error}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Total Subscribers: <span className="font-bold text-navy dark:text-white">{subscribers.length}</span>
        </p>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">No subscribers yet.</td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-navy dark:text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {sub.email}
                    </td>
                    <td className="p-4">
                      {sub.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                          <XCircle className="w-3 h-3" /> Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
