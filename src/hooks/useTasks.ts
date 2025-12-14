import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS, GET_TASK } from "@/graphql/queries";
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK } from "@/graphql/mutations";
import { Task } from "@/types";
import { toast } from "sonner";

interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: string;
  assigneeEmail: string | null;
  dueDate: string | null;
  createdAt: string;
  project: { id: string };
}

const transformTask = (task: TaskResponse): Task => ({
  projectById: {
    id: task.id,
    project_id: task.project.id,
    title: task.title,
    description: task.description || "",
    status: task.status as Task["status"],
    assignee_email: task.assigneeEmail || "",
    due_date: task.dueDate,
    created_at: task.createdAt,
  },
});

export function useTasks(projectId: string | null) {
  const { data, loading, error, refetch } = useQuery<{ tasks: TaskResponse[] }>(
    GET_TASKS,
    {
      variables: { id: projectId },
      skip: !projectId,
    }
  );

  console.log("data: ", data);

  return {
    data: data?.projectById?.tasks ? data?.projectById?.tasks : undefined,
    isLoading: loading,
    error,
    refetch,
  };
}

export function useTask(taskId: string | null) {
  const { data, loading, error } = useQuery<{ task: TaskResponse }>(GET_TASK, {
    variables: { id: taskId },
    skip: !taskId,
  });

  return {
    data: data?.task ? transformTask(data.task) : undefined,
    isLoading: loading,
    error,
  };
}

export function useTaskCount(projectId: string | null) {
  const { data, loading } = useQuery<{ tasks: TaskResponse[] }>(GET_TASKS, {
    variables: { id: projectId },
    skip: !projectId,
  });

  const tasks = data?.tasks;
  const totalCount = tasks?.length || 0;
  const completedCount = tasks?.filter((t) => t.status === "DONE").length || 0;

  return {
    totalCount,
    completedCount,
    isLoading: loading,
  };
}

export function useCreateTask() {
  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    refetchQueries: ["GetTasks", "GetProjects"],
    onCompleted: () => {
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create task: " + error.message);
    },
  });

  return {
    mutateAsync: async (
      task: Omit<Task, "id" | "created_at">
    ): Promise<Task> => {
      const result = await createTask({
        variables: {
          projectId: task.project_id,
          title: task.title,
          description: task.description,
          status: task.status,
          assigneeEmail: task.assignee_email,
          dueDate: task.due_date,
        },
      });
      return transformTask(result.data?.createTask?.task);
    },
    isPending: loading,
  };
}

export function useUpdateTask() {
  const [updateTask, { loading }] = useMutation(UPDATE_TASK, {
    refetchQueries: ["GetTasks", "GetTask", "GetProjects"],
    onCompleted: () => {
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update task: " + error.message);
    },
  });

  return {
    mutateAsync: async ({
      id,
      ...updates
    }: Partial<Task> & { id: string }): Promise<Task> => {
      const result = await updateTask({
        variables: {
          id,
          title: updates.title,
          description: updates.description,
          status: updates.status,
          assigneeEmail: updates.assignee_email,
          dueDate: updates.due_date,
        },
      });
      return transformTask(result.data?.updateTask?.task);
    },
    isPending: loading,
  };
}

export function useDeleteTask() {
  const [deleteTask, { loading }] = useMutation(DELETE_TASK, {
    refetchQueries: ["GetTasks", "GetProjects"],
    onCompleted: () => {
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete task: " + error.message);
    },
  });

  return {
    mutateAsync: (id: string) => deleteTask({ variables: { id } }),
    isPending: loading,
  };
}
