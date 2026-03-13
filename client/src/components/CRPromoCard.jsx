/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Award, ExternalLink } from 'lucide-react';

const BURGUNDY = '#6B1D34';
const HUNTER = '#4A7C59';

export default function CRPromoCard() {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8B2542, #6B1D34)' }}>
          <Award className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-stone-900">
            Track Your Credentials with CounselorReady
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Keep all your licenses, certifications, and CE credits organized in one place.
            Get renewal reminders, audit-ready reports, and board-specific tracking.
          </p>
          <a
            href="https://counselorready.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: BURGUNDY }}
          >
            Learn more about credential tracking
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
