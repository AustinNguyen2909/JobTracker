import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  type DocumentSnapshot,
  type DocumentData,
  type FieldValue,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Task, TaskFormData, Subtask, Priority, TaskType } from "../types";

const TASKS_COLLECTION = "tasks";

interface FirestoreTaskDoc {
  title: string;
  description: string;
  type: TaskType;
  tags: string[];
  deadline: Timestamp | string | null;
  priority: Priority;
  estimationTime: number | null;
  links: string[];
  isCompleted: boolean;
  subtasks: Subtask[];
  createdAt?: FieldValue | Timestamp | string;
  updatedAt: FieldValue;
}

function docToTask(docSnap: DocumentSnapshot<DocumentData>): Task {
  const data = docSnap.data()!;
  return {
    id: docSnap.id,
    title: data.title || "",
    description: data.description || "",
    type: data.type || "personal",
    tags: data.tags || [],
    deadline: data.deadline
      ? data.deadline instanceof Timestamp
        ? data.deadline.toDate().toISOString().split("T")[0]
        : data.deadline
      : "",
    priority: data.priority || "medium",
    estimationTime: data.estimationTime || null,
    links: data.links || [],
    isCompleted: data.isCompleted || false,
    subtasks: data.subtasks || [],
    createdAt: data.createdAt
      ? data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt
      : new Date().toISOString(),
    updatedAt: data.updatedAt
      ? data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt
      : null,
  };
}

function taskToDoc(task: TaskFormData): FirestoreTaskDoc {
  const data: FirestoreTaskDoc = {
    title: task.title,
    description: task.description || "",
    type: task.type || "personal",
    tags: task.tags || [],
    priority: task.priority || "medium",
    estimationTime: task.estimationTime || null,
    links: task.links || [],
    isCompleted: task.isCompleted || false,
    subtasks: task.subtasks || [],
    updatedAt: serverTimestamp(),
    deadline: task.deadline
      ? Timestamp.fromDate(new Date(task.deadline + "T00:00:00"))
      : null,
  };

  return data;
}

export async function fetchTasks(): Promise<Task[]> {
  const q = query(collection(db, TASKS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToTask);
}

export async function createTask(task: TaskFormData): Promise<Task> {
  const data = taskToDoc(task);
  data.createdAt = serverTimestamp();
  const docRef = await addDoc(collection(db, TASKS_COLLECTION), data);
  return {
    ...task,
    id: docRef.id,
    description: task.description || "",
    type: task.type || "personal",
    tags: task.tags || [],
    deadline: task.deadline || "",
    priority: task.priority || "medium",
    estimationTime: task.estimationTime || null,
    links: task.links || [],
    isCompleted: task.isCompleted || false,
    subtasks: task.subtasks || [],
    createdAt: new Date().toISOString(),
  };
}

export async function updateTask(task: Task): Promise<Task> {
  const { id, ...rest } = task;
  const data = taskToDoc(rest);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateDoc(doc(db, TASKS_COLLECTION, id), data as any);
  return task;
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, TASKS_COLLECTION, id));
}

export async function toggleTaskComplete(id: string, isCompleted: boolean): Promise<void> {
  await updateDoc(doc(db, TASKS_COLLECTION, id), {
    isCompleted,
    updatedAt: serverTimestamp(),
  });
}
