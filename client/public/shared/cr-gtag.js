// CounselorReady Google Ads conversion tracking
// Conversion: Subscribe (free signup completion)
// Account: AW-16681104079
(function() {
  if (window.__crGtagLoaded) return;
  window.__crGtagLoaded = true;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16681104079';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', 'AW-16681104079');
})();

window.gtag_report_conversion = function(url) {
  var callback = function() {
    if (typeof(url) !== 'undefined' && url) { window.location = url; }
  };
  if (typeof gtag !== 'function') {
    if (url) window.location = url;
    return false;
  }
  gtag('event', 'conversion', {
    'send_to': 'AW-16681104079/Yp_1CJfQ9qMcEM_llZI-',
    'value': 1.0,
    'currency': 'USD',
    'event_callback': callback
  });
  return false;
};
