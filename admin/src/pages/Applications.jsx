import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { applicationsAPI } from '../api/applications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faClock, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewing, setReviewing] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationsAPI.getAll();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch applications' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (status) => {
    if (!selectedApp) return;
    setReviewing(true);
    try {
      await applicationsAPI.review(selectedApp.id, status);
      setToast({ type: 'success', message: `Application ${status} successfully!` });
      setIsReviewModalOpen(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.detail || `Failed to ${status} application` });
    } finally {
      setReviewing(false);
    }
  };

  const handleDelete = async (id, name = 'this applicant') => {
    if (!window.confirm(`Are you sure you want to permanently delete the application record for ${name}?`)) return;
    try {
      await applicationsAPI.delete(id);
      setToast({ type: 'success', message: 'Application deleted successfully!' });
      fetchApplications();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: err.response?.data?.detail || 'Failed to delete application' });
    }
  };

  const openReviewModal = (app) => {
    setSelectedApp(app);
    setIsReviewModalOpen(true);
  };

  const filteredApps = applications.filter((a) => {
    const term = search.toLowerCase();
    return (
      (a.first_name || '').toLowerCase().includes(term) ||
      (a.last_name || '').toLowerCase().includes(term) ||
      (a.email || '').toLowerCase().includes(term) ||
      (a.status || '').toLowerCase().includes(term)
    );
  });

  const columns = [
    {
      header: 'Applicant',
      render: (a) => (
        <div>
          <p className="font-bold text-gray-900 text-xs">
            {a.first_name} {a.last_name}
          </p>
          <p className="text-[11px] text-gray-500">{a.email}</p>
        </div>
      ),
    },
    {
      header: 'Programme & Year',
      render: (a) => (
        <div>
          <p className="text-xs text-gray-800">{a.programme || 'N/A'}</p>
          <p className="text-[11px] text-gray-500">Year {a.year_of_study || a.year || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (a) => {
        let bgColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        let icon = faClock;
        if (a.status === 'approved') {
          bgColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          icon = faCheckCircle;
        } else if (a.status === 'rejected') {
          bgColor = 'bg-red-100 text-red-800 border-red-200';
          icon = faTimesCircle;
        }
        return (
          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${bgColor}`}>
            <FontAwesomeIcon icon={icon} className="text-[10px]" />
            <span className="capitalize">{a.status}</span>
          </span>
        );
      },
    },
    {
      header: 'Applied Date',
      render: (a) => (
        <span className="text-[11px] text-gray-500 font-medium">
          {a.created_at ? new Date(a.created_at).toLocaleDateString() : 'N/A'}
        </span>
      ),
    }
  ];

  const actions = (a) => (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={() => openReviewModal(a)}
        title="Review Application"
        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1"
      >
        <FontAwesomeIcon icon={faEye} />
        <span className="text-xs font-semibold">Review</span>
      </button>
      {a.status !== 'pending' && (
        <button
          onClick={() => handleDelete(a.id, `${a.first_name} ${a.last_name}`)}
          title={`Delete ${a.status} Application`}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
        >
          <FontAwesomeIcon icon={faTrash} />
          <span className="text-xs font-semibold">Delete</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <DataTable
        title="Membership Applications"
        subtitle="Review and manage student membership applications. Approved and rejected applications can be archived or deleted."
        searchPlaceholder="Search by name or email..."
        searchValue={search}
        onSearchChange={setSearch}
        columns={columns}
        data={filteredApps}
        loading={loading}
        actions={actions}
      />

      {/* Review Modal */}
      {isReviewModalOpen && selectedApp && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title="Review Application"
          subtitle={`Applicant: ${selectedApp.first_name} ${selectedApp.last_name}`}
          hideFooter
        >
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-xs text-gray-500">Email</p>
                <p>{selectedApp.email}</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-gray-500">Phone</p>
                <p>{selectedApp.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-gray-500">Registration Number</p>
                <p>{selectedApp.registration_number || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-gray-500">Current Status</p>
                <p className="capitalize font-bold">{selectedApp.status}</p>
              </div>
            </div>
            
            <div>
              <p className="font-semibold text-xs text-gray-500 mb-1">Motivation / Bio</p>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap">
                {selectedApp.motivation || 'No motivation provided.'}
              </div>
            </div>

            {selectedApp.status === 'pending' && (
              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleReview('rejected')}
                  disabled={reviewing}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleReview('approved')}
                  disabled={reviewing}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-500/30"
                >
                  Approve Application
                </button>
              </div>
            )}
            {selectedApp.status !== 'pending' && (
              <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedApp.id;
                    const name = `${selectedApp.first_name} ${selectedApp.last_name}`;
                    setIsReviewModalOpen(false);
                    handleDelete(id, name);
                  }}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Delete Application Record</span>
                </button>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
