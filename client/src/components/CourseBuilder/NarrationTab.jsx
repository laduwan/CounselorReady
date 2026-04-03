// DROP INTO: client/src/components/CourseBuilder/NarrationTab.jsx
import NarrationPanel from "./NarrationPanel";
import { C } from "./constants";
import { S } from "./styles";

function NarrationTab({ courseData, setCourseData }) {
  if (!courseData?.modules?.length) {
    return (
      <div style={{ ...S.card, textAlign: "center", padding: 40 }}>
        <p style={{ color: C.textMuted, fontSize: 14 }}>
          No course content yet. Generate or import course content first, then come back to add narration.
        </p>
      </div>
    );
  }

  return (
    <NarrationPanel
      courseId={courseData._id || courseData.id || null}
      modules={courseData.modules}
      onNarrationComplete={({ modules }) => {
        setCourseData(prev => ({ ...prev, modules }));
      }}
    />
  );
}

export default NarrationTab;
