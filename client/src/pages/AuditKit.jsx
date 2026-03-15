/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileDown, CheckCircle, XCircle, FileText, Calendar, Award, BookOpen, Loader2, ArrowLeft } from 'lucide-react';

export default function AuditKit() {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [files, setFiles] = useState([]);

  const generatePackage = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const [auditRes, filesRes] = await Promise.all([
        api.get(`/audit-kit/prepare?${params}`),
        api.get('/audit-kit/files')
      ]);
      setAuditData(auditRes.data);
      setFiles(filesRes.data);
    } catch (err) {
      console.error('Failed to generate audit package:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-package-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!auditData) return;
    const rows = [['Title', 'Provider', 'Completion Date', 'CE Hours', 'Category', 'Certificate #', 'Verification Code']];
    for (const cert of auditData.certificates) {
      rows.push([
        cert.title, cert.provider, cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : '',
        cert.ceHours, cert.category, cert.certificateNumber || '', cert.verificationCode || ''
      ]);
    }
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ce-certificates-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Link to="/credentials" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-burgundy-700 mb-3 transition-colors"><ArrowLeft className="w-4 h-4" />Credentials</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Board Audit Preparation Kit</h1>
      <p className="text-gray-500 mb-6">Generate a comprehensive package of all your credentials, CE certificates, and compliance documentation — ready for board audit.</p>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Generate Audit Package</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date (optional)</label>
            <input type="date" value={dateRange.startDate} onChange={e => setDateRange({...dateRange, startDate: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date (optional)</label>
            <input type="date" value={dateRange.endDate} onChange={e => setDateRange({...dateRange, endDate: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <button onClick={generatePackage} disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 text-sm disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            {loading ? 'Generating...' : 'Generate Package'}
          </button>
        </div>
      </div>

      {auditData && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border p-4 text-center">
              <Award className="w-6 h-6 mx-auto text-burgundy-700 mb-2" />
              <p className="text-2xl font-bold">{auditData.summary.credentialCount}</p>
              <p className="text-xs text-gray-500">Credentials</p>
            </div>
            <div className="bg-white rounded-xl border p-4 text-center">
              <FileText className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold">{auditData.summary.totalCertificates}</p>
              <p className="text-xs text-gray-500">Certificates</p>
            </div>
            <div className="bg-white rounded-xl border p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto text-indigo-600 mb-2" />
              <p className="text-2xl font-bold">{auditData.summary.totalCEHoursDocumented}</p>
              <p className="text-xs text-gray-500">CE Hours Documented</p>
            </div>
            <div className="bg-white rounded-xl border p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold">{auditData.summary.totalCoursesCompleted}</p>
              <p className="text-xs text-gray-500">Courses Completed</p>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={downloadJSON} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
              <FileDown className="w-4 h-4" /> Download Full Package (JSON)
            </button>
            <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50">
              <FileDown className="w-4 h-4" /> Download CE Log (CSV)
            </button>
          </div>

          {/* Audit Checklist */}
          <div className="bg-white rounded-xl border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Audit Readiness Checklist</h2>
            <div className="space-y-3">
              {auditData.auditChecklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.done ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-400" />}
                  <span className={`text-sm ${item.done ? 'text-gray-700' : 'text-gray-500'}`}>{item.item}</span>
                  {item.note && <span className="text-xs text-gray-400 italic">({item.note})</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Credentials Detail */}
          <div className="bg-white rounded-xl border mb-6">
            <div className="p-4 border-b"><h2 className="text-lg font-semibold">Credentials</h2></div>
            <div className="divide-y">
              {auditData.credentials.map((cred, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{cred.name}</h3>
                    <span className={`text-sm font-medium ${cred.percentComplete >= 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {cred.percentComplete}% complete
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    {cred.licenseNumber && <div>License: <span className="font-medium">{cred.licenseNumber}</span></div>}
                    <div>Issuer: <span className="font-medium">{cred.issuingBody}</span></div>
                    <div>CE: <span className="font-medium">{cred.totalCEUsCompleted}/{cred.totalCEUsRequired} hrs</span></div>
                    {cred.expirationDate && <div>Expires: <span className="font-medium">{new Date(cred.expirationDate).toLocaleDateString()}</span></div>}
                  </div>
                  {/* Progress by category */}
                  {cred.requirements.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {cred.requirements.map((r, j) => (
                        <span key={j} className={`text-xs px-2 py-1 rounded-full ${r.remaining === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {r.category}: {r.completed}/{r.required}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certificates List */}
          <div className="bg-white rounded-xl border mb-6">
            <div className="p-4 border-b"><h2 className="text-lg font-semibold">CE Certificates ({auditData.certificates.length})</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-600">Title</th>
                    <th className="text-left p-3 font-medium text-gray-600">Provider</th>
                    <th className="text-left p-3 font-medium text-gray-600">Date</th>
                    <th className="text-left p-3 font-medium text-gray-600">Hours</th>
                    <th className="text-left p-3 font-medium text-gray-600">Category</th>
                    <th className="text-left p-3 font-medium text-gray-600">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {auditData.certificates.map((cert, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3">{cert.title}</td>
                      <td className="p-3 text-gray-500">{cert.provider}</td>
                      <td className="p-3">{cert.completionDate ? new Date(cert.completionDate).toLocaleDateString() : '-'}</td>
                      <td className="p-3 font-medium">{cert.ceHours}</td>
                      <td className="p-3">{cert.category}</td>
                      <td className="p-3 text-xs text-gray-500">{cert.verificationCode || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Downloadable Files */}
          {files.length > 0 && (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b"><h2 className="text-lg font-semibold">Certificate Files ({files.length})</h2></div>
              <div className="divide-y">
                {files.map((f, i) => (
                  <div key={i} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{f.title}</p>
                      <p className="text-xs text-gray-500">{f.ceHours} hrs \u2022 {f.category} \u2022 {f.fileName || 'Certificate'}</p>
                    </div>
                    <a href={f.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-burgundy-700 hover:underline flex items-center gap-1">
                      <FileDown className="w-4 h-4" /> Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
