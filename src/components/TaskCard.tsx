import {
  Calendar,
  Clock,
  Link as LinkIcon,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { MouseEvent } from "react";
import type { Task, Priority } from "../types";
import { getIsOverdue } from "../utility";

const priorityColors: Record<Priority, string> = {
  high: "var(--priority-high)",
  medium: "var(--priority-medium)",
  low: "var(--priority-low)",
};

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onToggleComplete: (id: string) => void;
}

export default function TaskCard({
  task,
  onClick,
  onToggleComplete,
}: TaskCardProps) {
  const completedSubtasks =
    task.subtasks?.filter((s) => s.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const isOverdue = getIsOverdue(task.deadline) && !task.isCompleted;

  return (
    <div
      onClick={onClick}
      className="task-card"
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.borderColor = "var(--border-color)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Priority strip */}
      <div
        className="task-priority-strip"
        style={{
          backgroundColor: priorityColors[task.priority] || priorityColors.low,
        }}
      />

      <div className="task-card-body">
        {/* Toggle */}
        <button
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          className="task-toggle"
          style={{
            color: task.isCompleted ? "var(--success)" : "var(--text-muted)",
          }}
        >
          {task.isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <div
            className="task-title"
            style={{
              color: task.isCompleted
                ? "var(--text-muted)"
                : "var(--text-primary)",
              textDecoration: task.isCompleted ? "line-through" : "none",
            }}
          >
            {task.title}
          </div>

          {/* Description */}
          {task.description && (
            <div className="task-desc">{task.description}</div>
          )}

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="task-tags">
              {task.tags.map((tag) => (
                <span key={tag} className="task-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="task-meta">
            {deadlineDate && (
              <span
                style={{
                  color: isOverdue ? "var(--danger)" : "var(--text-muted)",
                  fontWeight: isOverdue ? 600 : 400,
                }}
              >
                <Calendar size={12} />
                {deadlineDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}

            {task.estimationTime && (
              <span>
                <Clock size={12} />
                {task.estimationTime >= 60
                  ? `${Math.floor(task.estimationTime / 60)}h${task.estimationTime % 60 ? ` ${task.estimationTime % 60}m` : ""}`
                  : `${task.estimationTime}m`}
              </span>
            )}

            {task.links?.length > 0 && (
              <span>
                <LinkIcon size={12} />
                {task.links.length}
              </span>
            )}

            {totalSubtasks > 0 && (
              <span className="task-subtask-progress">
                {completedSubtasks}/{totalSubtasks}
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                      backgroundColor:
                        progress === 100 ? "var(--success)" : "var(--accent)",
                    }}
                  />
                </div>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
