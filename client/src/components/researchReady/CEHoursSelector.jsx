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
      <span className="font-[Georgia,serif] text-[10px] uppercase tracking-[0.12em] text-[#5C4D3A] italic self-center mr-2">CE Hours:</span>
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <button
            key={opt.label}
            onClick={() => onSelect(opt.value)}
            className={`flex flex-col items-center px-4 py-2 rounded-full text-sm font-[Georgia,serif] transition-colors border ${
              isActive
                ? 'bg-[#FDF8EE] border-[1.5px] border-[#7B2D3E] text-[#7B2D3E]'
                : 'bg-[#F5EEE0] text-[#5C4D3A] border-[#C8C3BC] hover:border-[#7B2D3E] hover:text-[#7B2D3E]'
            }`}
          >
            <span>{opt.label}</span>
            <span className={`text-[10px] ${isActive ? 'text-[#7B2D3E]/70' : 'text-[#7A6A54]'}`}>
              {opt.subtext}
            </span>
          </button>
        );
      })}
    </div>
  );
}
