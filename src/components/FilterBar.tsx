import type { FilterId, PriorityFilterId } from '../types';

interface FilterOption {
  id: FilterId;
  label: string;
}

interface PriorityOption {
  id: PriorityFilterId;
  label: string;
}

const filters: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past Due' },
];

const priorities: PriorityOption[] = [
  { id: 'all', label: 'All Priorities' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

interface FilterBarProps {
  activeFilter: FilterId;
  onFilterChange: (filter: FilterId) => void;
  activePriority: PriorityFilterId;
  onPriorityChange: (priority: PriorityFilterId) => void;
}

export default function FilterBar({ activeFilter, onFilterChange, activePriority, onPriorityChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-pills">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`filter-pill ${activeFilter === f.id ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <select
        value={activePriority}
        onChange={e => onPriorityChange(e.target.value as PriorityFilterId)}
        className="filter-select"
      >
        {priorities.map(p => (
          <option key={p.id} value={p.id}>{p.label}</option>
        ))}
      </select>
    </div>
  );
}
