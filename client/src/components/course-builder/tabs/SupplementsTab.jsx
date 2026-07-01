// ─── SupplementsTab ──────────────────────────────────────────────────────────
// DROP INTO: /client/src/components/course-builder/tabs/SupplementsTab.jsx
// Reads the loaded course's _id + courseCode from builder state and hands them to
// the self-contained SupplementsManager. Resources are saved through the manager's
// own endpoint (PUT /api/files/resources/:id) — the builder reducer does not track
// resources[], so there is no autosave conflict.

import { useCourseBuilder } from '../CourseBuilderContext.jsx';
import SupplementsManager from '../../SupplementsManager.jsx';

export default function SupplementsTab() {
  const { state } = useCourseBuilder();
  return (
    <div style={{ padding: '4px 2px' }}>
      <SupplementsManager courseId={state?._id} />
    </div>
  );
}
