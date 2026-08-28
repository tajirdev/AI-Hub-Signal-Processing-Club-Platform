import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';
import { newsletterApi } from '../api/newsletter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const data = await newsletterApi.getAll();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch newsletter subscribers' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { accessor: 'id', header: 'ID' },
    { accessor: 'email', header: 'Email' },
    { 
      accessor: 'status', 
      header: 'Status',
      render: (item) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          item.is_active 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {item.is_active ? 'Active' : 'Unsubscribed'}
        </span>
      )
    },
    { 
      accessor: 'created_at', 
      header: 'Subscribed At',
      render: (item) => new Date(item.created_at).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <FontAwesomeIcon icon={faEnvelopeOpenText} className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h1>
            <p className="text-sm text-gray-500">View and manage newsletter subscriptions</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <div className="text-sm text-gray-500">
            Total: <span className="font-bold text-gray-800">{filteredSubscribers.length}</span>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredSubscribers}
          loading={loading}
          emptyMessage="No subscribers found."
        />
      </div>
    </div>
  );
}
