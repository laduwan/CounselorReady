// ══════════════════════════════════════════════════════════════════
// ADMIN-COURSES.HTML — EDIT MODAL PATCH
// ══════════════════════════════════════════════════════════════════
//
// TWO CHANGES NEEDED:
//
// ── CHANGE 1 ──────────────────────────────────────────────────────
// In the renderCard() function, find this line:
//
//   <a href="/admin/course-builder?id=${c._id}"
//     class="h-8 px-3 rounded-lg text-xs font-medium bg-forest-50 hover:bg-forest-100 text-forest-700 transition-colors flex items-center">Edit</a>
//
// REPLACE WITH:
//
//   <button onclick="openEditModal('${c._id}','${src}')"
//     class="h-8 px-3 rounded-lg text-xs font-medium bg-forest-50 hover:bg-forest-100 text-forest-700 transition-colors flex items-center">Edit</button>
//
//
// ── CHANGE 2 ──────────────────────────────────────────────────────
// Add the following functions BEFORE the init(); call at the bottom.
// If openEditModal / saveEdit / closeEditModal already exist, REPLACE them.
// ══════════════════════════════════════════════════════════════════

    // ── Edit Modal ──
    let editCourseId = null;
    let editCourseSource = null;

    async function openEditModal(id, src) {
      editCourseId = id;
      editCourseSource = src;

      // Show modal immediately with loading state
      const modal = document.getElementById('editModal');
      modal.style.display = 'flex';

      try {
        // Fetch full course data
        let course;
        if (src === 'interactivecourses' || src === 'interactive') {
          const r = await fetch(`${API_URL}/api/interactive-courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!r.ok) throw new Error('Failed to load course');
          const json = await r.json();
          course = json.data || json;
        } else {
          const r = await fetch(`${API_URL}/api/admin/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!r.ok) throw new Error('Failed to load course');
          course = await r.json();
        }

        // Populate form fields
        document.getElementById('editTitle').value = course.title || '';
        document.getElementById('editSubtitle').value = course.subtitle || '';
        document.getElementById('editDescription').value = course.description || '';
        document.getElementById('editSlug').value = course.slug || '';
        document.getElementById('editCode').value = course.courseCode || '';
        document.getElementById('editCeHours').value = course.ceHours || course.ceuHours || '';
        document.getElementById('editCategory').value = course.category || '';
        document.getElementById('editPrice').value = course.price || '';
        document.getElementById('editTier').value = course.accessTier || 'Free';
        document.getElementById('editStatus').value = course.status || 'draft';
        document.getElementById('editPresenter').value = course.presenter || course.instructor || '';

        // Premium toggle
        const premiumEl = document.getElementById('editPremium');
        if (premiumEl) premiumEl.checked = !!course.isPremium;

        // Objectives — join as one-per-line
        const objEl = document.getElementById('editObjectives');
        if (objEl) {
          const objs = course.objectives || course.learningObjectives || [];
          objEl.value = Array.isArray(objs) ? objs.join('\n') : objs;
        }

        // Preview links
        const viewerLink = document.getElementById('editViewerLink');
        if (viewerLink) viewerLink.href = `/interactive-course.html?id=${id}`;
        const previewLink = document.getElementById('editPreviewLink');
        if (previewLink) previewLink.href = `/admin-course-preview.html?id=${id}`;

      } catch (e) {
        showToast('Error loading course: ' + e.message, '#dc2626');
        modal.style.display = 'none';
      }
    }

    function closeEditModal() {
      document.getElementById('editModal').style.display = 'none';
      editCourseId = null;
      editCourseSource = null;
    }

    async function saveEdit() {
      if (!editCourseId) return;

      const title = document.getElementById('editTitle').value.trim();
      if (!title) { showToast('Title is required', '#dc2626'); return; }

      const objectivesRaw = (document.getElementById('editObjectives')?.value || '').trim();
      const objectives = objectivesRaw ? objectivesRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

      const payload = {
        title,
        subtitle: document.getElementById('editSubtitle').value.trim(),
        description: document.getElementById('editDescription').value.trim(),
        slug: document.getElementById('editSlug').value.trim(),
        courseCode: document.getElementById('editCode').value.trim(),
        ceHours: parseFloat(document.getElementById('editCeHours').value) || 0,
        category: document.getElementById('editCategory').value,
        price: parseFloat(document.getElementById('editPrice').value) || 0,
        accessTier: document.getElementById('editTier').value,
        status: document.getElementById('editStatus').value,
        presenter: document.getElementById('editPresenter').value.trim(),
        objectives,
      };

      const premiumEl = document.getElementById('editPremium');
      if (premiumEl) payload.isPremium = premiumEl.checked;

      try {
        let r;
        if (editCourseSource === 'interactivecourses' || editCourseSource === 'interactive') {
          r = await fetch(`${API_URL}/api/interactive-courses/${editCourseId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          r = await fetch(`${API_URL}/api/admin/courses/${editCourseId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || err.message || `Save failed (${r.status})`);
        }

        closeEditModal();
        showToast('✓ Course updated', '#4A7C59');
        loadCourses();
      } catch (e) {
        showToast('Error: ' + e.message, '#dc2626');
      }
    }
