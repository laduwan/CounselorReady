/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Award, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  X,
  FileText,
  Upload,
  Camera,
  Scan,
  Eye,
  Trash2,
  Download,
  Loader,
  Image,
  File,
  Shield,
  ExternalLink
} from 'lucide-react';

export default function Credentials() {
  const navigate = useNavigate();
  const { hasSubscription } = useAuth();
  const [credentials, setCredentials] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState({ state_license: [], national_cert: [], specialty_cert: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('credentials');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogCEUModal, setShowLogCEUModal] = useState(null);
  const [showScanModal, setShowScanModal] = useState(null); // 'ce' or 'credential'
  const [showCertViewer, setShowCertViewer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [credsRes, templatesRes, certsRes] = await Promise.all([
        api.get('/credentials'),
        api.get('/credentials/templates/all'),
        api.get('/certificates').catch(() => ({ data: { certificates: [] } }))
      ]);
      setCredentials(credsRes.data.credentials || []);
      setTemplates(templatesRes.data.templates || {});
      setCertificates(certsRes.data.certificates || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (certId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await api.delete(`/certificates/${certId}`);
      setCertificates(prev => prev.filter(c => c._id !== certId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete certificate');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-700"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-burgundy-900 mb-2">Credentials & CE Tracking</h1>
          <p className="text-stone-600">Manage licenses, certifications, and continuing education hours</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowScanModal('ce')}
            className="flex items-center gap-2 px-6 py-2.5 bg-hunter-600 text-white rounded-lg hover:bg-hunter-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <Scan className="w-5 h-5" />
            Scan Certificate
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Credential
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-6">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'credentials'
                ? 'text-burgundy-700 border-b-2 border-burgundy-600 bg-burgundy-50'
                : 'text-stone-600 hover:text-burgundy-600 hover:bg-stone-50'
            }`}
          >
            My Credentials <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'credentials' ? 'bg-burgundy-100 text-burgundy-700' : 'bg-stone-200 text-stone-600'}`}>{credentials.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'certificates'
                ? 'text-burgundy-700 border-b-2 border-burgundy-600 bg-burgundy-50'
                : 'text-stone-600 hover:text-burgundy-600 hover:bg-stone-50'
            }`}
          >
            CE Certificates <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'certificates' ? 'bg-burgundy-100 text-burgundy-700' : 'bg-stone-200 text-stone-600'}`}>{certificates.length}</span>
          </button>
          <button
            onClick={() => navigate('/ce-planner')}
            className="px-6 py-4 text-sm font-medium text-stone-600 hover:text-burgundy-600 hover:bg-stone-50 transition-colors"
          >
            CE Planner
          </button>
          <button
            onClick={() => navigate('/audit-kit')}
            className="px-6 py-4 text-sm font-medium text-stone-600 hover:text-burgundy-600 hover:bg-stone-50 transition-colors"
          >
            Audit Kit
          </button>
        </div>
        <div className="p-6">

      {/* ── Credentials Tab ── */}
      {activeTab === 'credentials' && (
        <>
          {credentials.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {credentials.map((cred) => (
                <div key={cred._id} className="border border-stone-200 rounded-xl p-5 hover:border-hunter-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full border-4 border-hunter-600 flex items-center justify-center bg-white flex-shrink-0">
                        <span className="text-sm font-bold text-hunter-600">{cred.percentComplete}%</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-burgundy-600">{cred.name}</h3>
                        <p className="text-xs text-navy-600">{cred.issuingBody}</p>
                        {cred.licenseNumber && (
                          <p className="text-xs text-navy-600">#{cred.licenseNumber}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(cred.status)}`}>
                        {getStatusLabel(cred.status)}
                      </span>
                      <button
                        onClick={() => setShowLogCEUModal(cred)}
                        className="btn-secondary text-xs py-1 px-2"
                      >
                        Log CEU
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-honey-600 font-medium mb-2">
                    Expires: {formatDate(cred.expirationDate)}
                    {cred.daysUntilExpiration > 0 && (
                      <span> ({cred.daysUntilExpiration} days)</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-hunter-700">{cred.totalCEUsCompleted}</span>
                    <span className="text-stone-500">/{cred.totalCEUsRequired} CE hours</span>
                  </div>
                  {cred.requirements?.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {cred.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-stone-600">{req.category}</span>
                          <span className={req.hoursCompleted >= req.hoursRequired ? 'text-hunter-600' : 'text-stone-900'}>
                            {req.hoursCompleted}/{req.hoursRequired}
                            {req.hoursCompleted >= req.hoursRequired && (
                              <CheckCircle className="w-3 h-3 inline ml-1" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-stone-200 rounded-xl text-center py-12 px-6">
              <Award className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">No credentials yet</h3>
              <p className="text-stone-500 mb-6">
                Start tracking your licenses and certifications to stay on top of renewals.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowScanModal('credential')}
                  className="flex items-center gap-2 px-4 py-2 bg-hunter-600 text-white rounded-lg hover:bg-hunter-700 transition-colors text-sm font-medium"
                >
                  <Scan className="w-4 h-4" />
                  Scan Credential
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Manually
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Certificates Tab ── */}
      {activeTab === 'certificates' && (
        <>
          {certificates.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {certificates.map((cert) => {
                // Parse RNR metadata from notes
                let rnrMeta = null;
                try { rnrMeta = cert.notes ? JSON.parse(cert.notes) : null; } catch { /* not JSON */ }
                const isRnr = rnrMeta?.type === 'research_ready';

                if (isRnr) {
                  return <RnrCertTile key={cert._id} cert={cert} rnrMeta={rnrMeta} formatDate={formatDate} onDelete={handleDeleteCertificate} />;
                }

                return (
                <div key={cert._id} className="border border-stone-200 rounded-xl p-5 hover:border-hunter-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-stone-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-stone-900 truncate">{cert.title}</h3>
                        <p className="text-sm text-stone-500">{cert.provider}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(cert.completionDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {cert.ceHours} CE hours
                          </span>
                          {cert.category && (
                            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">
                              {cert.category}
                            </span>
                          )}
                          {cert.approvingBody && (
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {cert.approvingBody}
                            </span>
                          )}
                          {cert.nbccApproved && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              NBCC Approved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {cert.fileUrl && (
                        <button
                          onClick={() => setShowCertViewer(cert)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-hunter-600 border border-hunter-200 rounded-lg hover:bg-hunter-50 transition-colors"
                          title="View certificate"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCertificate(cert._id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete certificate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-stone-200 rounded-xl text-center py-12 px-6">
              <FileText className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">No certificates yet</h3>
              <p className="text-stone-500 mb-6">
                Upload or scan your CE certificates to keep them organized and track your hours.
              </p>
              <button
                onClick={() => setShowScanModal('ce')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-hunter-600 text-white rounded-lg hover:bg-hunter-700 transition-colors text-sm font-medium"
              >
                <Scan className="w-4 h-4" />
                Scan Your First Certificate
              </button>
            </div>
          )}
        </>
      )}

      </div>{/* end tab content padding */}
      </div>{/* end tab container */}

      {/* Modals */}
      {showAddModal && (
        <AddCredentialModal
          templates={templates}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); fetchData(); }}
          hasSubscription={hasSubscription}
          currentCount={credentials.length}
        />
      )}

      {showLogCEUModal && (
        <LogCEUModal
          credential={showLogCEUModal}
          onClose={() => setShowLogCEUModal(null)}
          onSuccess={() => { setShowLogCEUModal(null); fetchData(); }}
        />
      )}

      {showScanModal && (
        <ScanCertificateModal
          mode={showScanModal}
          onClose={() => setShowScanModal(null)}
          onSuccess={() => { setShowScanModal(null); fetchData(); }}
          credentials={credentials}
        />
      )}

      {showCertViewer && (
        <CertificateViewerModal
          certificate={showCertViewer}
          onClose={() => setShowCertViewer(null)}
        />
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// RNR CE Certificate Tile — research_ready type
// ─────────────────────────────────────────────────────────────────────────────
function RnrCertTile({ cert, rnrMeta, formatDate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const courseTitle = rnrMeta.courseTitle || cert.title;

  return (
    <div
      className="bg-[#FAF5EC] border border-[#DDD9D3] border-l-[3px] border-l-[#7B2D3E] rounded-r-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); } }}
    >
      {/* At-a-glance (collapsed) */}
      <h3 className="font-[Georgia,serif] text-[15px] text-[#2A1F0E] font-bold mb-2 leading-snug">
        {courseTitle}
      </h3>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#8B5E2E] text-[#FDF8EE]">
          {cert.ceHours} CE hrs
        </span>
        {cert.category && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F8EEDC] text-[#8B5E2E]">
            {cert.category}
          </span>
        )}
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
          NBCC Approved
        </span>
      </div>
      <p className="font-[Georgia,serif] text-[11px] text-[#5C4D3A] mb-3">
        Completed {formatDate(cert.completionDate)}
      </p>

      <div className="flex items-center gap-2">
        {cert.fileUrl && (
          <a
            href={cert.fileUrl}
            download
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B5E2E] text-[#FDF8EE] rounded text-[10px] font-[Georgia,serif] uppercase tracking-[0.05em] hover:bg-[#A5712E] transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
            aria-label={`Download CE syllabus for ${courseTitle}`}
          >
            <Download className="w-3 h-3" /> Download Syllabus
          </a>
        )}
        <button
          onClick={e => { e.stopPropagation(); onDelete(cert._id); }}
          className="p-1.5 text-[#7A6A54] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors focus-visible:outline-2 focus-visible:outline-[#8B5E2E] focus-visible:outline-offset-2"
          aria-label="Delete certificate"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#DDD9D3] space-y-3" onClick={e => e.stopPropagation()}>
          {/* Authors, journal, year, DOI */}
          {rnrMeta.authors && (
            <p className="font-[Georgia,serif] text-[11px] italic text-[#5C4D3A]">
              {rnrMeta.authors}
            </p>
          )}
          {rnrMeta.journals && (
            <p className="font-[Georgia,serif] text-[11px] italic text-[#7A6A54]">
              {rnrMeta.journals}
            </p>
          )}
          {rnrMeta.dois?.length > 0 && (
            <p className="font-[Georgia,serif] text-[10px] text-[#7A6A54]">
              DOI: {rnrMeta.dois.join('; ')}
            </p>
          )}

          {/* Full text source + URL (audit trail) */}
          {rnrMeta.fullTextSource && (
            <p className="font-[Georgia,serif] text-[10px] text-[#7A6A54]">
              Full text source: {rnrMeta.fullTextSource}
              {rnrMeta.fullTextUrl && (
                <> — <a href={rnrMeta.fullTextUrl} target="_blank" rel="noopener noreferrer" className="text-[#8B5E2E] underline hover:text-[#A5712E]">{rnrMeta.fullTextUrl}</a></>
              )}
            </p>
          )}

          {/* Learning objectives */}
          {rnrMeta.objectivesMet?.length > 0 && (
            <div>
              <p className="font-[Georgia,serif] text-[10px] uppercase tracking-[0.12em] text-[#5C4D3A] italic mb-1">
                Learning Objectives Met
              </p>
              <ol className="list-decimal list-inside space-y-1">
                {rnrMeta.objectivesMet.map((obj, i) => (
                  <li key={i} className="font-[Georgia,serif] text-[11px] text-[#2A1F0E] flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Assessment score + engagement */}
          {rnrMeta.assessmentScore != null && (
            <p className="font-[Georgia,serif] text-[11px] text-[#2A1F0E]">
              Assessment Score: <strong>{rnrMeta.assessmentScore}%</strong>
              {rnrMeta.correctCount != null && rnrMeta.totalQuestions && (
                <span className="text-[#7A6A54]"> — {rnrMeta.correctCount} of {rnrMeta.totalQuestions} correct</span>
              )}
            </p>
          )}
          {rnrMeta.engagementConfirmed != null && (
            <p className="font-[Georgia,serif] text-[10px] text-[#7A6A54]">
              Engagement confirmed: {rnrMeta.engagementConfirmed ? 'Yes' : 'No'}
            </p>
          )}

          {/* CE hour calculation */}
          {rnrMeta.ceCalcFormula && (
            <p className="font-[Georgia,serif] text-[10px] text-[#7A6A54]">
              {rnrMeta.ceCalcFormula}
            </p>
          )}

          {/* Research hours */}
          {rnrMeta.researchHours != null && (
            <p className="font-[Georgia,serif] text-[10px] text-[#7A6A54]">
              Research hours: {rnrMeta.researchHours}
            </p>
          )}

          {/* Certificate ID */}
          {cert.certificateNumber && (
            <p className="font-[Georgia,serif] text-[10px] text-[#7A6A54]">
              Certificate ID: {cert.certificateNumber}
            </p>
          )}

          {/* NBCC stamp */}
          <p className="font-[Georgia,serif] text-[10px] font-semibold text-[#7B2D3E] uppercase tracking-[0.05em]">
            {rnrMeta.nbccAcepStamp || 'NBCC ACEP #7760'}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scan Certificate Modal — supports both CE certificates and credential docs
// ─────────────────────────────────────────────────────────────────────────────

function ScanCertificateModal({ mode, onClose, onSuccess, credentials = [] }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedCredentials, setSelectedCredentials] = useState([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const isCEMode = mode === 'ce';
  const title = isCEMode ? 'Scan CE Certificate' : 'Scan Credential Document';
  const description = isCEMode 
    ? 'Upload a CE certificate (PDF or photo) and AI will extract the details.'
    : 'Upload your license or credential document to auto-fill details.';

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(selectedFile.type)) {
      setError('Please upload a PDF, JPG, or PNG file.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }
    setFile(selectedFile);
    setError('');
    setExtractedData(null);
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setDragOver(false); }, []);

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const endpoint = isCEMode ? '/scan' : '/scan/credential';
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });
      if (response.data?.success && response.data?.extracted) {
        setExtractedData(response.data.extracted);
      } else {
        setError('Could not extract data. Try a clearer image or enter details manually.');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.response?.data?.error || 'Scan failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleSave = async () => {
    if (!extractedData || !file) return;
    setSaving(true);
    setError('');
    try {
      if (isCEMode) {
        const formData = new FormData();
        formData.append('certificate', file);
        formData.append('title', extractedData.title || 'Untitled Certificate');
        formData.append('provider', extractedData.provider || 'Unknown Provider');
        formData.append('completionDate', extractedData.completionDate || new Date().toISOString().split('T')[0]);
        formData.append('ceHours', extractedData.ceHours || 0);
        formData.append('category', extractedData.category || 'General');
        formData.append('nbccApproved', extractedData.approvingBody === 'NBCC' || extractedData.approvingBody === 'ACEP');
        if (extractedData.approvingBody) formData.append('approvingBody', extractedData.approvingBody);
        if (extractedData.approvalNumber) formData.append('approvalNumber', extractedData.approvalNumber);
        if (extractedData.applicability) formData.append('applicability', extractedData.applicability);
        if (selectedCredentials.length > 0) formData.append('credentials', JSON.stringify(selectedCredentials));
        await api.post('/certificates/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSuccess();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditField = (field, value) => {
    setExtractedData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* ── Step 1: File Upload ── */}
            {!extractedData && (
              <>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragOver ? 'border-burgundy-500 bg-burgundy-100'
                      : file ? 'border-burgundy-400 bg-burgundy-100/50'
                      : 'border-gray-300 hover:border-burgundy-500 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                  {file ? (
                    <div>
                      {preview ? (
                        <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-3 shadow-sm" />
                      ) : (
                        <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <File className="w-8 h-8 text-red-500" />
                        </div>
                      )}
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(0)} KB &middot; Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-700">Drop your file here or click to browse</p>
                      <p className="text-sm text-gray-500 mt-1">Supports PDF, JPG, and PNG up to 10MB</p>
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <span className="flex items-center gap-1.5 text-xs text-gray-400"><File className="w-3.5 h-3.5" /> PDF</span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400"><Image className="w-3.5 h-3.5" /> JPG / PNG</span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400"><Camera className="w-3.5 h-3.5" /> Photo</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Take Photo — triggers camera on mobile */}
                {!file && (
                  <div className="mt-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 border-t border-gray-200"></div>
                      <span className="text-xs text-gray-400">or</span>
                      <div className="flex-1 border-t border-gray-200"></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-burgundy-400 rounded-xl hover:border-burgundy-600 hover:bg-burgundy-100 transition-all text-burgundy-800 font-medium"
                    >
                      <Camera className="w-5 h-5" />
                      Take Photo
                    </button>
                  </div>
                )}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                {file && (
                  <button
                    onClick={handleScan}
                    disabled={scanning}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-dustyrose-600 text-white rounded-lg hover:bg-dustyrose-700 transition-colors font-medium disabled:opacity-60"
                  >
                    {scanning ? (
                      <><Loader className="w-5 h-5 animate-spin" /> Scanning with AI...</>
                    ) : (
                      <><Scan className="w-5 h-5" /> Scan Certificate</>
                    )}
                  </button>
                )}
              </>
            )}

            {/* ── Step 2: Review CE Certificate Data ── */}
            {extractedData && isCEMode && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Data extracted! Review and edit below, then save.
                </div>

                <div className="space-y-3">
                  <EditableField label="Course/Training Title" value={extractedData.title} onChange={(v) => handleEditField('title', v)} />
                  <EditableField label="Provider" value={extractedData.provider} onChange={(v) => handleEditField('provider', v)} />
                  <div className="grid grid-cols-2 gap-3">
                    <EditableField label="Completion Date" value={extractedData.completionDate} onChange={(v) => handleEditField('completionDate', v)} type="date" />
                    <EditableField label="CE Hours" value={extractedData.ceHours} onChange={(v) => handleEditField('ceHours', v)} type="number" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select value={extractedData.category || 'General'} onChange={(e) => handleEditField('category', e.target.value)} className="input-field">
                        {['General','Ethics','Supervision','Telehealth','Cultural Diversity','Trauma','Substance Abuse','Core','Other'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <EditableField label="Approving Body" value={extractedData.approvingBody || ''} onChange={(v) => handleEditField('approvingBody', v)} />
                  </div>
                  {extractedData.approvalNumber && (
                    <EditableField label="Approval/Provider Number" value={extractedData.approvalNumber} onChange={(v) => handleEditField('approvalNumber', v)} />
                  )}
                  {extractedData.learnerName && (
                    <div className="text-sm text-gray-500">
                      Certificate holder: <span className="font-medium text-gray-700">{extractedData.learnerName}</span>
                    </div>
                  )}
                  {credentials.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Apply to Credentials</label>
                      <p className="text-xs text-gray-500 mb-2">Select which credentials this certificate counts toward.</p>
                      <div className="space-y-2">
                        {credentials.map(cred => (
                          <label key={cred._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCredentials.includes(cred._id)}
                              onChange={(e) => {
                                setSelectedCredentials(prev =>
                                  e.target.checked ? [...prev, cred._id] : prev.filter(id => id !== cred._id)
                                );
                              }}
                              className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                            />
                            <span className="text-sm text-gray-800">{cred.name} {cred.state ? `(${cred.state})` : ''}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setExtractedData(null); setFile(null); setPreview(null); }} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Start Over
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors font-medium disabled:opacity-60">
                    {saving ? (<><Loader className="w-4 h-4 animate-spin" /> Saving...</>) : (<><CheckCircle className="w-4 h-4" /> Save Certificate</>)}
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Credential Scan Results ── */}
            {extractedData && !isCEMode && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Credential data extracted!
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {extractedData.holderName && <div className="text-sm"><span className="text-gray-500">Name:</span> <span className="font-medium">{extractedData.holderName}</span></div>}
                  {extractedData.name && <div className="text-sm"><span className="text-gray-500">Credential:</span> <span className="font-medium">{extractedData.name}</span></div>}
                  {extractedData.state && <div className="text-sm"><span className="text-gray-500">State:</span> <span className="font-medium">{extractedData.state}</span></div>}
                  {extractedData.licenseNumber && <div className="text-sm"><span className="text-gray-500">License #:</span> <span className="font-medium">{extractedData.licenseNumber}</span></div>}
                  {extractedData.issuingBody && <div className="text-sm"><span className="text-gray-500">Issuing Body:</span> <span className="font-medium">{extractedData.issuingBody}</span></div>}
                  {extractedData.expirationDate && <div className="text-sm"><span className="text-gray-500">Expires:</span> <span className="font-medium">{extractedData.expirationDate}</span></div>}
                  {extractedData.templateName && (
                    <div className="mt-3 p-2 bg-burgundy-100 border border-burgundy-300 rounded text-sm text-burgundy-800">
                      ✓ Matched template: {extractedData.templateName}
                    </div>
                  )}
                  {extractedData.requiresVerification && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                      ⚠ {extractedData.verificationMessage || 'Template not found. Please add this credential manually.'}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setExtractedData(null); setFile(null); setPreview(null); }} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Scan Another
                  </button>
                  <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition-colors font-medium">
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Editable Field
// ─────────────────────────────────────────────────────────────────────────────

function EditableField({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="input-field"
        step={type === 'number' ? '0.5' : undefined}
      />
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Certificate Viewer Modal — fetches PDF via authenticated /serve endpoint
// ─────────────────────────────────────────────────────────────────────────────

function CertificateViewerModal({ certificate, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    let url = null;
    const loadCert = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || 'https://api.counselorready.com/api';
        const response = await fetch(`${baseUrl}/certificates/${certificate._id}/serve`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Failed to load (${response.status})`);
        const blob = await response.blob();
        url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error('Load certificate error:', err);
        setError('Unable to load certificate. It may have been removed or is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };
    loadCert();
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [certificate._id]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = certificate.fileName || `${certificate.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="min-w-0 mr-4">
              <h2 className="text-lg font-semibold text-gray-900 truncate">{certificate.title}</h2>
              <p className="text-sm text-gray-500">{certificate.provider} &middot; {certificate.ceHours} CE hours</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {pdfUrl && (
                <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
              )}
              <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden min-h-0">
            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Loader className="w-8 h-8 text-burgundy-700 animate-spin mx-auto mb-3" />
                  <p className="text-gray-500">Loading certificate...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center max-w-md">
                  <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium mb-2">Could not load certificate</p>
                  <p className="text-gray-500 text-sm mb-4">{error}</p>
                  {certificate.fileUrl && (
                    <a href={certificate.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-burgundy-700 hover:text-burgundy-800">
                      <ExternalLink className="w-4 h-4" /> Try opening directly
                    </a>
                  )}
                </div>
              </div>
            )}
            {pdfUrl && !loading && !error && (
              <iframe src={pdfUrl} className="w-full h-[70vh]" title={certificate.title} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Add Credential Modal
// ─────────────────────────────────────────────────────────────────────────────

function AddCredentialModal({ templates, onClose, onSuccess, hasSubscription, currentCount }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({ licenseNumber: '', expirationDate: '', issueDate: '' });
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
      await api.post('/credentials', { templateId: selectedTemplate._id, ...formData });
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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

            {step === 1 && (
              <div className="space-y-3">
                <p className="text-gray-600 mb-4">What type of credential?</p>
                {[
                  { id: 'state_license', label: 'State License', desc: 'LPC, LMHC, LPCC, etc.' },
                  { id: 'national_cert', label: 'National Certification', desc: 'NCC, ACS, MAC, etc.' },
                  { id: 'specialty_cert', label: 'Specialty Certification', desc: 'Trauma, telehealth, etc.' }
                ].map((type) => (
                  <button key={type.id} onClick={() => { setSelectedType(type.id); setStep(2); }} className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-burgundy-600 hover:bg-burgundy-100 transition-colors">
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && selectedType && (
              <div className="space-y-3">
                <button onClick={() => { setStep(1); setSelectedType(null); }} className="text-burgundy-700 hover:text-burgundy-800 text-sm flex items-center gap-1 mb-4">← Back</button>
                <p className="text-gray-600 mb-4">Select your credential:</p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {templates[selectedType]?.map((template) => (
                    <button key={template._id} onClick={() => { setSelectedTemplate(template); setStep(3); }} className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-burgundy-600 hover:bg-burgundy-100 transition-colors">
                      <div className="font-medium text-gray-900">{template.state && `${template.state} `}{template.code}</div>
                      <div className="text-sm text-gray-500">{template.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && selectedTemplate && (
              <div className="space-y-4">
                <button onClick={() => { setStep(2); setSelectedTemplate(null); }} className="text-burgundy-700 hover:text-burgundy-800 text-sm flex items-center gap-1 mb-4">← Back</button>
                <div className="bg-burgundy-100 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-burgundy-900">{selectedTemplate.state && `${selectedTemplate.state} `}{selectedTemplate.code}</h3>
                  <p className="text-sm text-burgundy-800">{selectedTemplate.name}</p>
                  <p className="text-sm text-burgundy-700 mt-1">{selectedTemplate.totalCEUsRequired} CEUs required every {selectedTemplate.renewalCycle} months</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License/Certificate Number</label>
                  <input type="text" value={formData.licenseNumber} onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))} className="input-field" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date *</label>
                  <input type="date" value={formData.expirationDate} onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                  <input type="date" value={formData.issueDate} onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))} className="input-field" />
                </div>
                <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full mt-4">{loading ? 'Adding...' : 'Add Credential'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Log CEU Modal
// ─────────────────────────────────────────────────────────────────────────────

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
    if (!formData.hours || !formData.description) { setError('Hours and description are required'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post(`/credentials/${credential._id}/log-ceu`, { ...formData, hours: parseFloat(formData.hours) });
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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
            <p className="text-gray-600">Adding CEU hours to: <span className="font-medium">{credential.name}</span></p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours *</label>
                <input type="number" step="0.5" min="0.5" value={formData.hours} onChange={(e) => setFormData(prev => ({ ...prev, hours: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} className="input-field">
                  {credential.requirements?.map((req) => (<option key={req.category} value={req.category}>{req.category}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="input-field" placeholder="e.g., Ethics Workshop at Conference" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <input type="text" value={formData.provider} onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))} className="input-field" placeholder="e.g., ACA, NBCC, PESI" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Completed</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Saving...' : 'Log CEU Hours'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
