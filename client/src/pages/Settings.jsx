/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Bell, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];

export default function Settings() {
  const { user, hasSubscription } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-burgundy-100 text-burgundy-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && <ProfileSettings user={user} />}
          {activeTab === 'notifications' && <NotificationSettings user={user} />}
          {activeTab === 'subscription' && <SubscriptionSettings user={user} hasSubscription={hasSubscription} />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ user }) {
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    state: user?.profile?.state || '',
    phone: user?.profile?.phone || user?.phone || '',
    licenseType: user?.profile?.licenseType || '',
    licenseNumber: user?.profile?.licenseNumber || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/users/profile', formData);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            className="input-field bg-gray-50"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            className="input-field"
          >
            <option value="">Select your state</option>
            {US_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Used to show relevant CE requirements</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="input-field"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Type
            </label>
            <input
              type="text"
              value={formData.licenseType}
              onChange={(e) => setFormData(prev => ({ ...prev, licenseType: e.target.value }))}
              className="input-field"
              placeholder="e.g. LPC, LCSW, LMFT"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function NotificationSettings({ user }) {
  const [settings, setSettings] = useState({
    emailReminders: user?.notifications?.emailReminders ?? true,
    marketingEmails: user?.notifications?.marketingEmails ?? true,
    reminderFrequency: user?.notifications?.reminderFrequency || '3months'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/users/notifications', settings);
      setMessage({ type: 'success', text: 'Notification preferences updated' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update preferences' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Credential Reminders</h3>
            <p className="text-sm text-gray-500">Get notified before your credentials expire</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, emailReminders: !prev.emailReminders }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailReminders ? 'bg-burgundy-700' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.emailReminders ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Marketing Emails</h3>
            <p className="text-sm text-gray-500">New courses, features, and tips</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, marketingEmails: !prev.marketingEmails }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.marketingEmails ? 'bg-burgundy-700' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Reminder Frequency</h3>
          <select
            value={settings.reminderFrequency}
            onChange={(e) => setSettings(prev => ({ ...prev, reminderFrequency: e.target.value }))}
            className="input-field"
          >
            <option value="6months">6 months before expiration</option>
            <option value="3months">3 months before expiration</option>
            <option value="1month">1 month before expiration</option>
            <option value="1week">1 week before expiration</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}

function SubscriptionSettings({ user, hasSubscription }) {
  const status = user?.subscription?.status;
  const plan = user?.subscription?.plan;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Plan</h2>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-gray-900">
                {plan === 'free' ? 'Free' : 
                 plan === 'pro_monthly' ? 'Pro Monthly' :
                 plan === 'pro_annual' ? 'Pro Annual' : 
                 plan === 'lifetime' ? 'Lifetime' : 'Free'}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                status === 'active' || status === 'lifetime' ? 'bg-green-100 text-green-700' :
                status === 'trial' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {status === 'trial' ? 'Trial' : 
                 status === 'active' ? 'Active' : 
                 status === 'lifetime' ? 'Lifetime' :
                 status === 'canceled' ? 'Canceled' : 'Expired'}
              </span>
            </div>
            {status === 'trial' && user?.subscription?.trialEndsAt && (
              <p className="text-sm text-gray-500">
                Trial ends: {formatDate(user.subscription.trialEndsAt)}
              </p>
            )}
            {status === 'active' && user?.subscription?.currentPeriodEnd && (
              <p className="text-sm text-gray-500">
                Renews: {formatDate(user.subscription.currentPeriodEnd)}
              </p>
            )}
          </div>
        </div>

        {!hasSubscription && (
          <div className="bg-burgundy-100 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-burgundy-900 mb-2">Upgrade to Pro</h3>
            <ul className="space-y-2 text-sm text-burgundy-800 mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                All courses included
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Unlimited credential tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Email & calendar reminders
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Certificate storage
              </li>
            </ul>
            <div className="flex gap-3">
              <button className="btn-primary">
                $19/month
              </button>
              <button className="btn-secondary">
                $149/year (save 35%)
              </button>
            </div>
          </div>
        )}

        {hasSubscription && status !== 'lifetime' && (
          <button className="text-gray-500 hover:text-gray-700 text-sm">
            Cancel subscription
          </button>
        )}
      </div>

      {/* Billing history placeholder */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h2>
        <p className="text-gray-500 text-sm">No billing history available.</p>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="input-field"
            placeholder="At least 8 characters"
            required
            minLength={8}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="input-field"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
