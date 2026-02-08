import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Award, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ChevronRight,
  X,
  FileText
} from 'lucide-react';

export default function Credentials() {
  const { hasSubscription } = useAuth();
  const [credentials, setCredentials] = useState([]);
  const [templates, setTemplates] = useState({ state_license: [], national_cert: [], specialty_cert: [] });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogCEUModal, setShowLogCEUModal] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [credsRes, templatesRes] = await Promise.all([
        api.get('/credentials'),
        api.get('/credentials/templates/all')
      ]);
      setCredentials(credsRes.data.credentials || []);
      setTemplates(templatesRes.data.templates || {});
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-700';
      case 'expiring_soon': return 'bg-amber-100 text-amber-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'expired': return 'Expired';
      case 'expiring_soon': return 'Expiring Soon';
      default: return 'Active';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credentials</h1>
          <p className="text-gray-600">Track your licenses, certifications, and CEUs</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Credential
        </button>
      </div>

      {/* Credentials list */}
      {credentials.length > 0 ? (
        <div className="space-y-4">
          {credentials.map((cred) => (
            <div key={cred._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-honey-400 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-honey-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cred.name}</h3>
                    <p className="text-sm text-gray-500">{cred.issuingBody}</p>
                    {cred.licenseNumber && (
                      <p className="text-sm text-gray-500">License #: {cred.licenseNumber}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cred.status)}`}>
                    {getStatusLabel(cred.status)}
                  </span>
                  <button
                    onClick={() => setShowLogCEUModal(cred)}
                    className="btn-secondary text-sm py-1.5"
                  >
                    Log CEU
                  </button>
                </div>
              </div>

              {/* Expiration info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Expires: {formatDate(cred.expirationDate)}</span>
                {cred.daysUntilExpiration > 0 && (
                  <span className="text-gray-400">({cred.daysUntilExpiration} days)</span>
                )}
              </div>

              {/* Progress section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">CEU Progress</span>
                  <span className="text-forest-600 font-medium">
                    {cred.totalCEUsCompleted}/{cred.totalCEUsRequired} hours
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-forest-500 rounded-full" 
                    style={{ width: `${cred.percentComplete}%` }}
                  ></div>
                </div>

                {/* Requirements breakdown */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cred.requirements?.map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{req.category}</span>
                      <span className={req.hoursCompleted >= req.hoursRequired ? 'text-green-600' : 'text-gray-900'}>
                        {req.hoursCompleted}/{req.hoursRequired}
                        {req.hoursCompleted >= req.hoursRequired && (
                          <CheckCircle className="w-3 h-3 inline ml-1" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent CEU logs */}
              {cred.ceuLogs?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {cred.ceuLogs.slice(-3).reverse().map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{log.description}</span>
                        </div>
                        <span className="text-forest-600">+{log.hours} hrs</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No credentials yet</h3>
          <p className="text-gray-500 mb-6">
            Start tracking your licenses and certifications to stay on top of renewals.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Credential
          </button>
        </div>
      )}

      {/* Add Credential Modal */}
      {showAddModal && (
        <AddCredentialModal
          templates={templates}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchData();
          }}
          hasSubscription={hasSubscription}
          currentCount={credentials.length}
        />
      )}

      {/* Log CEU Modal */}
      {showLogCEUModal && (
        <LogCEUModal
          credential={showLogCEUModal}
          onClose={() => setShowLogCEUModal(null)}
          onSuccess={() => {
            setShowLogCEUModal(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// Add Credential Modal Component
function AddCredentialModal({ templates, onClose, onSuccess, hasSubscription, currentCount }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    expirationDate: '',
    issueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedTemplate || !formData.expirationDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/credentials', {
        templateId: selectedTemplate._id,
        ...formData
      });
      onSuccess();
    } catch (err) {
      if (err.response?.data?.code === 'CREDENTIAL_LIMIT') {
        setError('Free accounts are limited to 1 credential. Upgrade to Pro for unlimited.');
      } else {
        setError(err.response?.data?.error || 'Failed to add credential');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Add Credential</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <p className="text-gray-600 mb-4">What type of credential?</p>
                {[
                  { id: 'state_license', label: 'State License', desc: 'LPC, LMHC, LPCC, etc.' },
                  { id: 'national_cert', label: 'National Certification', desc: 'NCC, ACS, MAC, etc.' },
                  { id: 'specialty_cert', label: 'Specialty Certification', desc: 'Trauma, telehealth, etc.' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => { setSelectedType(type.id); setStep(2); }}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-burgundy-500 hover:bg-burgundy-100 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && selectedType && (
              <div className="space-y-3">
                <button
                  onClick={() => { setStep(1); setSelectedType(null); }}
                  className="text-forest-600 hover:text-forest-700 text-sm flex items-center gap-1 mb-4"
                >
                  ← Back
                </button>
                <p className="text-gray-600 mb-4">Select your credential:</p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {templates[selectedType]?.map((template) => (
                    <button
                      key={template._id}
                      onClick={() => { setSelectedTemplate(template); setStep(3); }}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-burgundy-500 hover:bg-burgundy-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {template.state && `${template.state} `}{template.code}
                      </div>
                      <div className="text-sm text-gray-500">{template.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && selectedTemplate && (
              <div className="space-y-4">
                <button
                  onClick={() => { setStep(2); setSelectedTemplate(null); }}
                  className="text-forest-600 hover:text-forest-700 text-sm flex items-center gap-1 mb-4"
                >
                  ← Back
                </button>
                
                <div className="bg-forest-100 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-forest-700">
                    {selectedTemplate.state && `${selectedTemplate.state} `}{selectedTemplate.code}
                  </h3>
                  <p className="text-sm text-forest-700">{selectedTemplate.name}</p>
                  <p className="text-sm text-forest-600 mt-1">
                    {selectedTemplate.totalCEUsRequired} CEUs required every {selectedTemplate.renewalCycle} months
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License/Certificate Number
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    className="input-field"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full mt-4"
                >
                  {loading ? 'Adding...' : 'Add Credential'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Log CEU Modal Component
function LogCEUModal({ credential, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    hours: '',
    category: credential.requirements?.[0]?.category || 'General',
    description: '',
    provider: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hours || !formData.description) {
      setError('Hours and description are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post(`/credentials/${credential._id}/log-ceu`, {
        ...formData,
        hours: parseFloat(formData.hours)
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log CEU');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Log CEU Hours</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <p className="text-gray-600">
              Adding CEU hours to: <span className="font-medium">{credential.name}</span>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={formData.hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                >
                  {credential.requirements?.map((req) => (
                    <option key={req.category} value={req.category}>{req.category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field"
                placeholder="e.g., Ethics Workshop at Conference"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                className="input-field"
                placeholder="e.g., ACA, NBCC, PESI"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Completed
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Saving...' : 'Log CEU Hours'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
