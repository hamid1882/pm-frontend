import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PROJECTS,
  GET_PROJECT,
  GET_PROJECT_STATS,
} from "@/graphql/queries";
import {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} from "@/graphql/mutations";
import { Project, ProjectWithStats } from "@/types";
import { toast } from "sonner";

interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  createdAt: string;
  organization: { id: string };
}

const transformProject = (project: ProjectResponse): Project => ({
  id: project.id,
  organization_id: project.organization.id,
  name: project.name,
  description: project.description || "",
  status: project.status as Project["status"],
  due_date: project.dueDate,
  created_at: project.createdAt,
});

export function useProjects(organizationId: string | null) {
  const { data, loading, error, refetch } = useQuery<{
    projects: ProjectResponse[];
  }>(GET_PROJECTS, {
    variables: { organizationId },
    skip: !organizationId,
  });

  const projects = data?.organizationById?.projects;

  const projectsWithStats: ProjectWithStats[] | undefined = projects?.map(
    (project) => ({
      ...project,
      taskCount: 0,
      completedTasks: 0,
    })
  );

  return {
    data: projectsWithStats,
    isLoading: loading,
    error,
    refetch,
  };
}

export function useProject(projectId: string | null) {
  const { data, loading, error } = useQuery<{ project: ProjectResponse }>(
    GET_PROJECT,
    {
      variables: { id: projectId },
      skip: !projectId,
    }
  );

  return {
    data: data?.projectById ? data?.projectById : undefined,
    isLoading: loading,
    error,
  };
}

export function useProjectStats(projectId: string | null) {
  const { data, loading, error } = useQuery<{
    basicProjectStats: {
      totalTasks: number;
      completedTasks: number;
      completionRate: number;
    };
  }>(GET_PROJECT_STATS, {
    variables: { projectId },
    skip: !projectId,
  });

  return {
    data: data?.basicProjectStats,
    isLoading: loading,
    error,
  };
}

export function useCreateProject() {
  const [createProject, { loading }] = useMutation(CREATE_PROJECT, {
    refetchQueries: (result) => {
      const organizationId =
        result.data?.createProject?.project?.organization?.id;
      if (organizationId) {
        return [
          {
            query: GET_PROJECTS,
            variables: { organizationId },
          },
        ];
      }
      return [];
    },
    onCompleted: () => {
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create project: " + error.message);
    },
  });

  return {
    mutateAsync: async (
      project: Omit<Project, "id" | "created_at" | "updated_at">
    ): Promise<Project> => {
      const result = await createProject({
        variables: {
          organizationId: project.organization_id,
          name: project.name,
          description: project.description,
          status: project.status,
          dueDate: project.due_date,
        },
      });
      return transformProject(result.data?.createProject?.project);
    },
    isPending: loading,
  };
}

export function useUpdateProject() {
  const [updateProject, { loading }] = useMutation(UPDATE_PROJECT, {
    refetchQueries: ["GetProjects", "GetProject"],
    onCompleted: () => {
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update project: " + error.message);
    },
  });

  return {
    mutateAsync: async ({
      id,
      ...updates
    }: Partial<Project> & { id: string }): Promise<Project> => {
      const result = await updateProject({
        variables: {
          id,
          name: updates.name,
          description: updates.description,
          status: updates.status,
          dueDate: updates.due_date,
        },
      });
      return transformProject(result.data?.updateProject?.project);
    },
    isPending: loading,
  };
}

export function useDeleteProject() {
  const [deleteProject, { loading }] = useMutation(DELETE_PROJECT, {
    refetchQueries: ["GetProjects"],
    onCompleted: () => {
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete project: " + error.message);
    },
  });

  return {
    mutateAsync: (id: string) => deleteProject({ variables: { id } }),
    isPending: loading,
  };
}
