/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * CReady™ Viewer — © 2026 GAITP LLC
 */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// The full CReady™ Viewer now lives at interactive-course.html.
// This component redirects React Router requests to the standalone viewer page.
export default function CourseViewer({ courseSlug }) {
  const { slug } = useParams();
  const target = courseSlug || slug;

  useEffect(() => {
    if (target) {
      window.location.href = '/interactive-course.html?slug=' + target;
    }
  }, [target]);

  return null;
}
