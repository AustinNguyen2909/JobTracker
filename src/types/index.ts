export type Priority = 'low' | 'medium' | 'high';

export type TaskType = 'personal' | 'work';

export type TabId = 'all' | 'personal' | 'work';

export type FilterId = 'all' | 'active' | 'completed' | 'upcoming' | 'past';

export type PriorityFilterId = 'all' | Priority;

export type ThemeName = 'dark' | 'light';

export interface Subtask {
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  tags: string[];
  deadline: string;
  priority: Priority;
  estimationTime: number | null;
  links: string[];
  isCompleted: boolean;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt?: string | null;
}

/** Shape used when creating/editing — id is optional (absent on create) */
export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
};

export interface ThemeVariables {
  '--bg-primary': string;
  '--bg-secondary': string;
  '--bg-card': string;
  '--bg-sidebar': string;
  '--bg-input': string;
  '--bg-hover': string;
  '--bg-modal-overlay': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--text-muted': string;
  '--text-inverse': string;
  '--border-color': string;
  '--border-focus': string;
  '--accent': string;
  '--accent-hover': string;
  '--accent-light': string;
  '--accent-soft': string;
  '--success': string;
  '--warning': string;
  '--danger': string;
  '--info': string;
  '--priority-high': string;
  '--priority-medium': string;
  '--priority-low': string;
  '--shadow-sm': string;
  '--shadow-md': string;
  '--shadow-lg': string;
}

export interface SharedTokens {
  '--radius-sm': string;
  '--radius-md': string;
  '--radius-lg': string;
  '--radius-full': string;
  '--transition': string;
}

export interface ThemeContextValue {
  theme: ThemeName;
  toggleTheme: () => void;
}
