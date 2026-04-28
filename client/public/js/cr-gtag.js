/**
 * CounselorReady — Google Ads Tracking (cr-gtag.js)
 * Drop in: client/public/js/cr-gtag.js
 * Usage: <script src="/js/cr-gtag.js"></script> in every page <head>
 *
 * Conversion ID: AW-16681104079
 * Sign-up conversion label: 169CCJTQ9qMcEM_llZI-
 */

// 1. Load gtag.js
(function(){
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16681104079';
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'AW-16681104079');
})();

// 2. Conversion helper — call from any page
window.crTrackConversion = function(type, value, currency) {
  if (typeof gtag !== 'function') return;

  var labels = {
    'subscribe':    'AW-16681104079/169CCJTQ9qMcEM_llZI-',
    'signup':       'AW-16681104079/169CCJTQ9qMcEM_llZI-',  // reuse until separate action created
    'trial_start':  'AW-16681104079/169CCJTQ9qMcEM_llZI-',  // reuse until separate action created
    'purchase':     'AW-16681104079/169CCJTQ9qMcEM_llZI-'
  };

  var label = labels[type];
  if (!label) return;

  gtag('event', 'conversion', {
    'send_to': label,
    'value': value || 1.0,
    'currency': currency || 'USD'
  });
};

// 3. Auto-detect conversion pages and fire
(function(){
  var path = window.location.pathname;
  var params = new URLSearchParams(window.location.search);

  // Registration success — register.html redirects to /welcome.html
  if (path.includes('welcome')) {
    window.crTrackConversion('signup', 0, 'USD');
  }

  // Subscription success — Stripe redirects to /subscription.html?success=true&session_id=...
  if (path.includes('subscription') && (params.get('success') === 'true' || params.get('session_id'))) {
    var plan = params.get('plan') || 'starter';
    var prices = { starter: 19.99, professional: 29.99, vip: 49.99, annual_vip: 299.99 };
    var value = prices[plan] || 19.99;
    window.crTrackConversion('subscribe', value, 'USD');
  }

  // Individual course purchase — Stripe redirects to /course-success.html or /purchase-success.html
  if ((path.includes('course-success') || path.includes('purchase-success')) && params.get('session_id')) {
    window.crTrackConversion('purchase', 29, 'USD');
  }
})();
