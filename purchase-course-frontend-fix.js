// ═══════════════════════════════════════════════════════════════
//  FRONTEND FIX — course-details.html
//  Replace the existing purchaseCourse() and checkUserAccess()
//  functions with these versions.
// ═══════════════════════════════════════════════════════════════


// ── STEP 1: Replace purchaseCourse() ────────────────────────
// Find the existing purchaseCourse() function and replace it entirely:

    // Purchase course individually via Stripe Checkout
    async function purchaseCourse() {
      if (!currentUser) {
        window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.href)}`;
        return;
      }

      const btn = document.querySelector('[onclick="purchaseCourse()"]');
      const originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Redirecting to checkout...';
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/payments/purchase-course`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ courseId: currentCourse._id })
        });

        const data = await response.json();

        if (!response.ok) {
          // Already purchased — just start the course
          if (data.error === 'You already own this course') {
            window.location.href = `/interactive-course.html?slug=${currentCourse.slug}`;
            return;
          }
          throw new Error(data.error || 'Purchase failed');
        }

        // Redirect to Stripe Checkout
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL returned');
        }
      } catch (error) {
        console.error('Purchase error:', error);
        alert(error.message || 'Something went wrong. Please try again.');
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }
    }


// ── STEP 2: Replace checkUserAccess() ───────────────────────
// The current version only checks subscription tier.
// This version ALSO checks if the user purchased the course individually.

    function checkUserAccess(requiredTier) {
      if (!currentUser) return false;
      if (requiredTier === 'free') return true;

      // Check individual purchase first
      if (currentUser.purchasedCourses && currentUser.purchasedCourses.length > 0) {
        const owned = currentUser.purchasedCourses.some(
          pc => pc.courseId === currentCourse._id || pc.slug === currentCourse.slug
        );
        if (owned) return true;
      }

      // Fall back to subscription check
      const userTier = currentUser.subscription?.plan || 'free';
      const userStatus = currentUser.subscription?.status;

      if (userStatus !== 'active') return false;

      const tierLevels = { 'free': 0, 'professional': 1, 'vip': 2 };
      return tierLevels[userTier] >= tierLevels[requiredTier];
    }


// ── STEP 3: Update renderPricing() ─────────────────────────
// Inside the existing renderPricing() function, find the line:
//   const hasAccess = checkUserAccess(accessTier);
// 
// AFTER that line, add this block to show "You own this course" 
// for individually purchased courses:
//
//     // Check if individually purchased
//     if (hasAccess && currentUser.purchasedCourses) {
//       const owned = currentUser.purchasedCourses.some(
//         pc => pc.courseId === currentCourse._id || pc.slug === currentCourse.slug
//       );
//       if (owned) {
//         document.getElementById('individualPriceSection').innerHTML = `
//           <div class="text-center mb-4">
//             <div class="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
//               <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
//               You own this course
//             </div>
//           </div>
//         `;
//         document.getElementById('individualPriceSection').classList.remove('hidden');
//       }
//     }
