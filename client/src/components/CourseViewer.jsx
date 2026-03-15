/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * CReady™ Viewer — © 2026 GAITP LLC
 */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function CourseViewer() {
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      window.location.href = '/interactive-course.html?slug=' + slug;
    }
  }, [slug]);

  return null;
}
