/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { createContext, useContext, useState, useEffect } from 'react';

const ImpersonateContext = createContext(null);

export function ImpersonateProvider({ children }) {
  const [impersonating, setImpersonating] = useState(() => {
    const id = sessionStorage.getItem('cr_impersonate_partner_id');
    const name = sessionStorage.getItem('cr_impersonate_partner_name');
    return id ? { id, name } : null;
  });

  function startImpersonating(partnerId, partnerName) {
    sessionStorage.setItem('cr_impersonate_partner_id', partnerId);
    sessionStorage.setItem('cr_impersonate_partner_name', partnerName);
    setImpersonating({ id: partnerId, name: partnerName });
  }

  function stopImpersonating() {
    sessionStorage.removeItem('cr_impersonate_partner_id');
    sessionStorage.removeItem('cr_impersonate_partner_name');
    setImpersonating(null);
  }

  return (
    <ImpersonateContext.Provider value={{ impersonating, startImpersonating, stopImpersonating }}>
      {children}
    </ImpersonateContext.Provider>
  );
}

export function useImpersonate() {
  const context = useContext(ImpersonateContext);
  if (!context) {
    throw new Error('useImpersonate must be used within an ImpersonateProvider');
  }
  return context;
}
