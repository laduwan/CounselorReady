/**
 * WordCountBadge — shows word count status as a colored pill.
 * Green = sufficient (250+), Gold = borderline (100-249), Red = thin (<100)
 */
export default function WordCountBadge({ wordCount, ceHours, wcStatus }) {
  if (wcStatus === 'sufficient') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {wordCount.toLocaleString()} words &middot; {ceHours} CE hr{ceHours !== 1 ? 's' : ''} ready
      </span>
    );
  }

  if (wcStatus === 'borderline') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        {wordCount} words &middot; Borderline — admin review required
      </span>
    );
  }

  // thin
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
      {wordCount} words &middot; Thin — must pair with second article
    </span>
  );
}
