import { ClipboardList, Plus } from 'lucide-react';
import type { MouseEvent } from 'react';

interface EmptyStateProps {
  onCreateTask: () => void;
}

export default function EmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <ClipboardList size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
      <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--text-muted)' }}>
        No tasks here yet
      </p>
      <button
        onClick={onCreateTask}
        className="btn-create"
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
      >
        <Plus size={16} />
        Add Task
      </button>
    </div>
  );
}
