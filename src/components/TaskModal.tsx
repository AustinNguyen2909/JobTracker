import { useState, type CSSProperties, type MouseEvent, type KeyboardEvent } from 'react';
import {
  X, Calendar, Clock, Link as LinkIcon, Tag, CheckCircle2, Circle,
  Trash2, Plus, ExternalLink, Flag,
} from 'lucide-react';
import type { Task, TaskFormData, Subtask, Priority } from '../types';

interface PriorityOption {
  value: Priority;
  label: string;
  color: string;
}

const priorityOptions: PriorityOption[] = [
  { value: 'low', label: 'Low', color: 'var(--priority-low)' },
  { value: 'medium', label: 'Medium', color: 'var(--priority-medium)' },
  { value: 'high', label: 'High', color: 'var(--priority-high)' },
];

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color var(--transition)',
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
  display: 'block',
};

interface TaskModalProps {
  task: Task | null;
  allTags?: string[];
  onClose: () => void;
  onSave: (task: TaskFormData) => void;
  onDelete: (id: string) => void;
}

interface FormState {
  title: string;
  description: string;
  type: 'personal' | 'work';
  tags: string[];
  deadline: string;
  priority: Priority;
  estimationTime: string | number;
  links: string[];
  subtasks: Subtask[];
}

export default function TaskModal({ task, allTags = [], onClose, onSave, onDelete }: TaskModalProps) {
  const isEditing = !!task?.id;
  const [form, setForm] = useState<FormState>({
    title: task?.title || '',
    description: task?.description || '',
    type: task?.type || 'personal',
    tags: task?.tags || [],
    deadline: task?.deadline || '',
    priority: task?.priority || 'medium',
    estimationTime: task?.estimationTime || '',
    links: task?.links || [],
    subtasks: task?.subtasks || [],
  });
  const [newTag, setNewTag] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      update('tags', [...form.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const addLink = () => {
    if (newLink.trim()) {
      update('links', [...form.links, newLink.trim()]);
      setNewLink('');
    }
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      update('subtasks', [...form.subtasks, { title: newSubtask.trim(), isCompleted: false }]);
      setNewSubtask('');
    }
  };

  const toggleSubtask = (idx: number) => {
    const updated = form.subtasks.map((s, i) =>
      i === idx ? { ...s, isCompleted: !s.isCompleted } : s
    );
    update('subtasks', updated);
  };

  const removeSubtask = (idx: number) => {
    update('subtasks', form.subtasks.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({
      ...task,
      ...form,
      estimationTime: form.estimationTime ? Number(form.estimationTime) : null,
    } as TaskFormData);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-modal-overlay)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
      className="glass"
    >
      <div
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: 600,
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: 28,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
            {isEditing ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              style={inputStyle}
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Add more details..."
            />
          </div>

          {/* Type & Priority row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Workspace</label>
              <select
                style={inputStyle}
                value={form.type}
                onChange={e => update('type', e.target.value as 'personal' | 'work')}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {priorityOptions.map(p => (
                  <button
                    key={p.value}
                    onClick={() => update('priority', p.value)}
                    style={{
                      flex: 1,
                      padding: '9px 0',
                      borderRadius: 'var(--radius-sm)',
                      border: form.priority === p.value ? `2px solid ${p.color}` : '1px solid var(--border-color)',
                      backgroundColor: form.priority === p.value ? 'var(--accent-soft)' : 'var(--bg-input)',
                      color: form.priority === p.value ? p.color : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: form.priority === p.value ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all var(--transition)',
                    }}
                  >
                    <Flag size={12} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Deadline & Estimation row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>
                <Calendar size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                Deadline
              </label>
              <input
                type="date"
                style={inputStyle}
                value={form.deadline}
                onChange={e => update('deadline', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Clock size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                Est. Time (min)
              </label>
              <input
                type="number"
                style={inputStyle}
                value={form.estimationTime}
                onChange={e => update('estimationTime', e.target.value)}
                placeholder="e.g. 120"
                min="0"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>
              <Tag size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
              Tags
            </label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: form.tags.length ? 10 : 0 }}>
              {form.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: 12,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {tag}
                  <button
                    onClick={() => update('tags', form.tags.filter(t => t !== tag))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0, lineHeight: 1 }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={newTag}
                  onChange={e => { setNewTag(e.target.value); setShowTagSuggestions(true); }}
                  onFocus={() => setShowTagSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Type to add or search tags..."
                />
                <button
                  onClick={addTag}
                  style={{
                    padding: '0 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              {/* Tag suggestions dropdown */}
              {showTagSuggestions && (() => {
                const suggestions = allTags.filter(
                  t => !form.tags.includes(t) && t.toLowerCase().includes(newTag.toLowerCase())
                );
                if (suggestions.length === 0) return null;
                return (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 48,
                      marginTop: 4,
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-md)',
                      zIndex: 10,
                      maxHeight: 150,
                      overflowY: 'auto',
                    }}
                  >
                    {suggestions.map(tag => (
                      <button
                        key={tag}
                        onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          update('tags', [...form.tags, tag]);
                          setNewTag('');
                          setShowTagSuggestions(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          width: '100%',
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'var(--text-primary)',
                          fontSize: 13,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color var(--transition)',
                        }}
                        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Tag size={12} color="var(--text-muted)" />
                        {tag}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Links */}
          <div>
            <label style={labelStyle}>
              <LinkIcon size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
              Links
            </label>
            {form.links.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                {form.links.map((link, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      color: 'var(--accent)',
                      padding: '6px 10px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <ExternalLink size={13} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {link}
                    </span>
                    <button
                      onClick={() => update('links', form.links.filter((_, j) => j !== i))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={newLink}
                onChange={e => setNewLink(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                placeholder="https://..."
              />
              <button
                onClick={addLink}
                style={{
                  padding: '0 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label style={labelStyle}>Subtasks</label>
            {form.subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                {form.subtasks.map((subtask, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <button
                      onClick={() => toggleSubtask(i)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: subtask.isCompleted ? 'var(--success)' : 'var(--text-muted)',
                      }}
                    >
                      {subtask.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: subtask.isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: subtask.isCompleted ? 'line-through' : 'none',
                      }}
                    >
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => removeSubtask(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                placeholder="Add a subtask..."
              />
              <button
                onClick={addSubtask}
                style={{
                  padding: '0 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 28,
            paddingTop: 20,
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <div>
            {isEditing && task && (
              <button
                onClick={() => onDelete(task.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--danger)',
                  backgroundColor: 'transparent',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all var(--transition)',
                }}
              >
                <Trash2 size={15} />
                Delete
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: 'var(--accent)',
                color: 'var(--text-inverse)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all var(--transition)',
              }}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
