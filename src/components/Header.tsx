import { Sun, Moon, Search, Plus, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import type { CSSProperties, MouseEvent } from 'react';
import type { TabId } from '../types';

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onCreateTask: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function Header({
  activeTab,
  onTabChange,
  onCreateTask,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  const iconBtnStyle: CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-card)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    transition: 'all var(--transition)',
    flexShrink: 0,
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'personal', label: 'Personal' },
    { id: 'work', label: 'Work' },
  ];

  return (
    <header className="app-header">
      {/* Left: Tabs */}
      <div className="header-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`header-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Center: Search */}
      <div className="header-search">
        <Search size={15} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {/* Right: Actions */}
      <div className="header-actions">
        <button onClick={toggleTheme} style={iconBtnStyle} title="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={onCreateTask}
          className="btn-create"
          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
        >
          <Plus size={16} />
          <span className="btn-create-label">New Task</span>
        </button>

        <button onClick={signOut} style={iconBtnStyle} title="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
