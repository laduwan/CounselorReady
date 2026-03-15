/**
 * CEHoursSelector — Segmented pill selector for desired CE hours.
 */
const options = [
  { value: null, label: 'Any', subtext: 'All results' },
  { value: 0.5, label: '0.5 hr', subtext: '~30 min read' },
  { value: 1.0, label: '1.0 hr', subtext: '~60 min read' },
  { value: 1.5, label: '1.5 hrs', subtext: '~90 min read' },
  { value: 2.0, label: '2.0 hrs', subtext: '~120 min read' },
];

export default function CEHoursSelector({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="text-sm font-medium text-gray-600 self-center mr-2">CE Hours:</span>
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.label}
            onClick={() => onSelect(opt.value)}
            className={`flex flex-col items-center px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              isActive
                ? 'bg-burgundy-700 text-white border-burgundy-700'
                : 'bg-white text-gray-700 border-gray-300 hover:border-burgundy-300 hover:bg-burgundy-50'
            }`}
          >
            <span>{opt.label}</span>
            <span className={`text-[10px] ${isActive ? 'text-burgundy-200' : 'text-gray-400'}`}>
              {opt.subtext}
            </span>
          </button>
        );
      })}
    </div>
  );
}
