import { useState, useEffect, useMemo, useCallback } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import EmptyState from "./components/EmptyState";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from "./services/taskService";
import type {
  Task,
  TaskFormData,
  TabId,
  FilterId,
  PriorityFilterId,
} from "./types";
import "./App.css";
import { getIsOverdue } from "./utility";

function AppContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [activeFilter, setActiveFilter] = useState<FilterId>("upcoming");
  const [activePriority, setActivePriority] = useState<PriorityFilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTasks()
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        setError("Failed to load tasks. Check your connection.");
        setLoading(false);
      });
  }, []);

  const toggleComplete = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const newValue = !task.isCompleted;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCompleted: newValue } : t)),
      );
      try {
        await toggleTaskComplete(id, newValue);
      } catch (err) {
        console.error("Failed to toggle task:", err);
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isCompleted: !newValue } : t)),
        );
      }
    },
    [tasks],
  );

  const handleSave = useCallback(async (taskData: TaskFormData) => {
    try {
      if (taskData.id) {
        const updated = await updateTask(taskData as Task);
        setTasks((prev) =>
          prev.map((t) => (t.id === updated.id ? { ...updated } : t)),
        );
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [created, ...prev]);
      }
      setShowModal(false);
      setModalTask(null);
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setShowModal(false);
      setModalTask(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }, []);

  const openCreate = () => {
    setModalTask(null);
    setShowModal(true);
  };
  const openEdit = (task: Task) => {
    setModalTask(task);
    setShowModal(true);
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((t) => t.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeTab === "personal" && task.type !== "personal") return false;
      if (activeTab === "work" && task.type !== "work") return false;

      if (activeFilter === "completed" && !task.isCompleted) return false;
      if (
        activeFilter === "upcoming" &&
        (!task.deadline || getIsOverdue(task.deadline) || task.isCompleted)
      )
        return false;
      if (
        activeFilter === "past" &&
        (!task.deadline || !getIsOverdue(task.deadline) || task.isCompleted)
      )
        return false;

      if (activePriority !== "all" && task.priority !== activePriority)
        return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description?.toLowerCase().includes(q);
        const matchesTags = task.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      return true;
    });
  }, [tasks, activeTab, activeFilter, activePriority, searchQuery]);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-center">
          <div className="spinner" />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <div className="loading-center">
          <p style={{ color: "var(--danger)", fontWeight: 600 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-create"
            style={{ marginTop: 12 }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateTask={openCreate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="app-content">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activePriority={activePriority}
          onPriorityChange={setActivePriority}
        />

        {filteredTasks.length > 0 ? (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => openEdit(task)}
                onToggleComplete={toggleComplete}
              />
            ))}
          </div>
        ) : (
          <EmptyState onCreateTask={openCreate} />
        )}
      </main>

      {showModal && (
        <TaskModal
          task={modalTask}
          allTags={allTags}
          onClose={() => {
            setShowModal(false);
            setModalTask(null);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-center">
          <div className="spinner" />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen />;
  return <AppContent />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  );
}
