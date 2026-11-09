import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { formatDate } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { MessageSquare, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

export default function AdminFeedback() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await adminService.getFeedback();
      setMessages(res || []);
    } catch (err) {
      console.error('Failed to load feedback', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleToggleRead = async (id, currentRead) => {
    try {
      await adminService.updateFeedbackStatus(id, { read: !currentRead });
      fetchFeedback();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminService.deleteFeedback(id);
      addToast('Message deleted', 'info');
      fetchFeedback();
    } catch (err) {
      addToast('Failed to delete message', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Customer Inquiries
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Contact & Feedback Inbox
          </h1>
        </div>

        <button
          onClick={fetchFeedback}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Loading Customer Messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center space-y-2 border border-slate-200 shadow-xs">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-base font-bold text-slate-900">No customer inquiries yet.</p>
            <p className="text-xs text-slate-500">Messages submitted through the contact page will appear here.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all shadow-xs ${
                msg.read
                  ? 'bg-white border-slate-200'
                  : 'bg-emerald-50/40 border-emerald-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{msg.subject || 'General Inquiry'}</h3>
                  <p className="text-xs text-slate-500">From: <strong className="text-slate-800">{msg.name}</strong> ({msg.email}) {msg.phone && `· Phone: ${msg.phone}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{formatDate(msg.createdAt)}</span>
                  <button
                    onClick={() => handleToggleRead(msg.id, msg.read)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      msg.read
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>{msg.read ? 'Mark Unread' : 'Mark Read'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
