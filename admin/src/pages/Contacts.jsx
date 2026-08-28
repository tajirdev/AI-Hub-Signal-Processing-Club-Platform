import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';
import { getContacts, updateContactStatus, deleteContact } from '../api/contacts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faTrash, faCheck, faHistory } from '@fortawesome/free-solid-svg-icons';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await getContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch contact messages' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateContactStatus(id, newStatus);
      setToast({ type: 'success', message: `Message marked as ${newStatus}` });
      fetchContacts();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to update status' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteContact(id);
      setToast({ type: 'success', message: 'Message deleted successfully' });
      fetchContacts();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete message' });
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Subject', accessor: 'subject', render: (row) => row.subject || '-' },
    { 
      header: 'Message', 
      accessor: 'message',
      render: (row) => (row.message && row.message.length > 50 ? row.message.substring(0, 50) + '...' : row.message)
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status?.toUpperCase()}
        </span>
      )
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    }
  ];

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
            <p className="text-sm text-gray-500">View and manage messages from the public contact form</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <DataTable 
          title="All Messages"
          searchPlaceholder="Search by name or email..."
          searchValue={search}
          onSearchChange={setSearch}
          columns={columns} 
          data={filteredContacts} 
          loading={loading}
          actions={(row) => (
            <div className="flex space-x-2 justify-end">
              {row.status !== 'resolved' ? (
                <button 
                  onClick={() => handleUpdateStatus(row.id, 'resolved')}
                  className="text-green-500 hover:text-green-700"
                  title="Mark as Resolved"
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              ) : (
                <button 
                  onClick={() => handleUpdateStatus(row.id, 'pending')}
                  className="text-yellow-500 hover:text-yellow-700"
                  title="Mark as Pending"
                >
                  <FontAwesomeIcon icon={faHistory} />
                </button>
              )}
              <button 
                onClick={() => handleDelete(row.id)}
                className="text-red-500 hover:text-red-700"
                title="Delete Message"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
