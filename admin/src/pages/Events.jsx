import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { eventsAPI } from '../api/events';
import { getImageUrl } from '../api/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faImage, faCalendarAlt, faMapMarkerAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [toast, setToast] = useState(null);

  // Event Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    registration_link: '',
    status: 'published',
  });

  // Cover Upload Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadEvent, setUploadEvent] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventsAPI.getAll({
        page,
        limit: 10,
        search: search || undefined,
      });

      if (data && data.events) {
        setEvents(data.events);
        setTotalPages(data.total_pages || 1);
        setTotalItems(data.total || 0);
      } else if (Array.isArray(data)) {
        setEvents(data);
        setTotalPages(1);
        setTotalItems(data.length);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to fetch events' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, search]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      event_date: new Date().toISOString().slice(0, 16),
      location: 'MUST Main Campus / Virtual',
      registration_link: '',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title || '',
      description: evt.description || '',
      event_date: evt.event_date ? new Date(evt.event_date).toISOString().slice(0, 16) : '',
      location: evt.location || '',
      registration_link: evt.registration_link || '',
      status: evt.status || 'published',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        event_date: new Date(formData.event_date).toISOString(),
      };

      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, payload);
        setToast({ type: 'success', message: 'Event updated successfully' });
      } else {
        await eventsAPI.create(payload);
        setToast({ type: 'success', message: 'Event scheduled successfully' });
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setToast({
        type: 'error',
        message: typeof detail === 'string' ? detail : 'Failed to save event',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsAPI.delete(id);
      setToast({ type: 'success', message: 'Event deleted successfully' });
      fetchEvents();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to delete event' });
    }
  };

  const handleOpenUpload = (evt) => {
    setUploadEvent(evt);
    setCoverFile(null);
    setIsUploadOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!coverFile || !uploadEvent) return;
    setUploading(true);
    try {
      await eventsAPI.uploadCover(uploadEvent.id, coverFile);
      setToast({ type: 'success', message: 'Event cover poster uploaded' });
      setIsUploadOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to upload event cover' });
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      header: 'Event',
      render: (e) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-10 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs flex-shrink-0 overflow-hidden border border-indigo-200">
            {e.cover_image_url ? (
              <img src={getImageUrl(e.cover_image_url)} alt="Poster" className="w-full h-full object-cover" />
            ) : (
              <FontAwesomeIcon icon={faCalendarAlt} />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs line-clamp-1">{e.title}</p>
            <div className="flex items-center space-x-1 text-[11px] text-gray-500">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[10px]" />
              <span>{e.location}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      render: (e) => (
        <span className="text-xs font-semibold text-gray-800">
          {e.event_date ? new Date(e.event_date).toLocaleString() : 'TBA'}
        </span>
      ),
    },
    {
      header: 'Registration',
      render: (e) =>
        e.registration_link ? (
          <a
            href={e.registration_link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold inline-flex items-center space-x-1"
          >
            <span>Register Link</span>
            <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[9px]" />
          </a>
        ) : (
          <span className="text-[11px] text-gray-400">Open Access</span>
        ),
    },
    {
      header: 'Status',
      render: (e) => (
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            e.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {e.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Club Events & Workshops"
        subtitle="Manage conferences, hackathons, and technical bootcamps."
        searchPlaceholder="Search events..."
        searchValue={search}
        onSearchChange={setSearch}
        onCreateNew={handleOpenCreate}
        createButtonText="Schedule Event"
        columns={columns}
        data={events}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        actions={(row) => (
          <div className="flex items-center justify-end space-x-1">
            <button
              onClick={() => handleOpenUpload(row)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Upload Poster"
            >
              <FontAwesomeIcon icon={faImage} />
            </button>
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Event"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Event"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      />

      {/* Event Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event Schedule' : 'Schedule Club Event'}
        subtitle="Specify event timing, venue/link, and description."
        onSubmit={handleSubmit}
        submitText={editingEvent ? 'Save Changes' : 'Schedule Event'}
        submitting={submitting}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Event Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Signal Processing & Computer Vision Workshop 2026"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status *</label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Venue / Physical Location *</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. MUST Nyerere Hall / Google Meet"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Registration Link (URL)</label>
          <input
            type="url"
            value={formData.registration_link}
            onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
            placeholder="https://forms.gle/... or platform link"
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Event Description *</label>
          <textarea
            rows="4"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Agenda, speakers, prerequisites, and learning outcomes..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </Modal>

      {/* Upload Poster Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Event Cover Poster"
        subtitle={`Select a promotional banner for "${uploadEvent?.title}".`}
        onSubmit={handleUploadSubmit}
        submitText="Upload Poster"
        submitting={uploading}
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Select Poster File</label>
          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />
        </div>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
