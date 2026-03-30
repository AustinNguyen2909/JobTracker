import dayjs from "dayjs";

/**
 * Check if a task is overdue - the day is considered to be the next day
 * @param deadline - The deadline of the task
 * @returns True if the task is overdue, false otherwise
 */
export const getIsOverdue = (deadline: string) => {
  const deadlineDate = deadline ? new Date(dayjs(deadline).add(1, "day").toDate()) : null;
  return deadlineDate && deadlineDate < new Date();
};
