import React, { useState } from 'react';

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

const AdminNotificationPanel: React.FC = () => {
  const [notificationType, setNotificationType] = useState<'all' | 'topic' | 'user'>('all');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [clerkUserId, setClerkUserId] = useState('');
  const [topic, setTopic] = useState('all_users');
  const [customData, setCustomData] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');

  const parseCustomData = (): Record<string, string> | undefined => {
    if (!customData.trim()) return undefined;
    try {
      return JSON.parse(customData);
    } catch {
      setError('Invalid JSON in custom data');
      return undefined;
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('API Key is required');
      return;
    }

    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }

    if (notificationType === 'user' && !clerkUserId.trim()) {
      setError('User ID is required for user notifications');
      return;
    }

    if (notificationType === 'topic' && !topic.trim()) {
      setError('Topic name is required');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const payload: NotificationPayload = {
        title,
        body,
        data: parseCustomData(),
      };

      let endpoint = '/api/send-notification-all';
      const requestBody: any = { ...payload };

      if (notificationType === 'user') {
        endpoint = '/api/send-notification-user';
        requestBody.clerkUserId = clerkUserId;
      } else if (notificationType === 'topic') {
        endpoint = '/api/send-notification-topic';
        requestBody.topic = topic;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send notification');
        return;
      }

      setResponse(data);
      setTitle('');
      setBody('');
      setClerkUserId('');
      setCustomData('');
      setTopic('all_users');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Admin Notification Panel
          </h1>
          <p className="text-slate-400">Send push notifications to EVChamp users</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSendNotification}
          className="rounded-3xl border border-slate-800 bg-slate-950/70 backdrop-blur-xl p-6 sm:p-8 space-y-6"
        >
          {/* API Key */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Admin API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your admin API key"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">Set as ADMIN_API_KEY in environment variables</p>
          </div>

          {/* Notification Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Send To
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['all', 'topic', 'user'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNotificationType(type as any)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    notificationType === type
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40'
                      : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {type === 'all' ? '🌍 All Devices' : type === 'topic' ? '📢 Topic' : '👤 User'}
                </button>
              ))}
            </div>
          </div>

          {/* Type-specific fields */}
          {notificationType === 'user' && (
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Clerk User ID
              </label>
              <input
                type="text"
                value={clerkUserId}
                onChange={(e) => setClerkUserId(e.target.value)}
                placeholder="user_xxxxxxxxxxxxx"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          {notificationType === 'topic' && (
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Topic Name
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., all_users, premium_users"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New Service Available"
              maxLength={65}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">{title.length}/65 characters</p>
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Notification Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="e.g., Check out our latest battery diagnostic features!"
              maxLength={240}
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">{body.length}/240 characters</p>
          </div>

          {/* Custom Data */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Custom Data (JSON - Optional)
            </label>
            <textarea
              value={customData}
              onChange={(e) => setCustomData(e.target.value)}
              placeholder='{"action": "open_diagnostics", "targetPath": "/zeflash"}'
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Use this to pass data that triggers actions when notification is tapped
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="rounded-lg border border-red-500/60 bg-red-950/40 px-4 py-3 text-sm text-red-100 flex items-start gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Response */}
          {response && (
            <div className="rounded-lg border border-emerald-500/60 bg-emerald-950/40 px-4 py-3 space-y-2">
              <div className="text-sm font-semibold text-emerald-100 flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Notification sent successfully!
              </div>
              <pre className="text-xs text-emerald-200 bg-emerald-950/50 rounded p-2 overflow-x-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-4 py-3 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/40 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                Send Notification
              </>
            )}
          </button>
        </form>

        {/* Instructions */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Setup Instructions</h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p>1. Set <code className="bg-slate-950 px-2 py-1 rounded text-cyan-400">ADMIN_API_KEY</code> in your environment variables</p>
            <p>2. Ensure Firebase Admin SDK is initialized in your backend</p>
            <p>3. Users must have the app installed with notifications enabled</p>
            <p>4. Fill in the form and click "Send Notification"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationPanel;
