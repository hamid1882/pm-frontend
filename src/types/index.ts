export interface Organization {
  id: string;
  name: string;
  slug: string;
  contact_email: string;
  created_at: string;
}

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  due_date: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee_email: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  content: string;
  author_email: string;
  created_at: string;
}

export interface ProjectWithStats extends Project {
  taskCount: number;
  completedTasks: number;
}

export type ProjectStatus = Project["status"];
export type TaskStatus = Task["status"];
