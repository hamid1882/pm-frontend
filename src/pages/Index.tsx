import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectStats } from "@/components/stats/ProjectStats";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskDetail } from "@/components/tasks/TaskDetail";
import { OrganizationForm } from "@/components/organizations/OrganizationForm";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import {
  useOrganizations,
  useCreateOrganization,
} from "@/hooks/useOrganizations";
import {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
} from "@/hooks/useProjects";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import { useComments, useCreateComment } from "@/hooks/useComments";
import { Organization, Task, TaskStatus } from "@/types";

type View = "projects" | "project-detail" | "task-detail";

const Index = () => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<View>("projects");

  // Form states
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingProject, setEditingProject] = useState(false);
  const [editingTask, setEditingTask] = useState(false);

  // Queries
  const {
    data: organizations = [],
    isLoading: orgsLoading,
    error: orgsError,
  } = useOrganizations();
  const { data: projects = [], isLoading: projectsLoading } = useProjects(
    selectedOrg?.id ?? null
  );
  const { data: project } = useProject(selectedProjectId);

  const { data: tasks = [], isLoading: tasksLoading } =
    useTasks(selectedProjectId);
  const { data: comments = [], isLoading: commentsLoading } = useComments(
    selectedTask?.id ?? null
  );

  // Log any errors for debugging
  if (orgsError) {
    console.error("Organizations error:", orgsError);
  }

  // Mutations
  const createOrg = useCreateOrganization();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createComment = useCreateComment();

  // Auto-select first organization
  useEffect(() => {
    if (organizations.length > 0 && !selectedOrg) {
      setSelectedOrg(organizations[0]);
    }
  }, [organizations, selectedOrg]);

  const handleCreateOrg = async (data: {
    name: string;
    slug: string;
    contact_email: string;
  }) => {
    try {
      const newOrg = await createOrg.mutateAsync(data);
      setSelectedOrg(newOrg);
      setShowOrgForm(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCreateProject = async (data: any) => {
    if (!selectedOrg) return;
    try {
      await createProject.mutateAsync({
        ...data,
        organization_id: selectedOrg.id,
        description: data.description || "",
        due_date: data.due_date || null,
      });
      setShowProjectForm(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUpdateProject = async (data: any) => {
    if (!selectedProjectId) return;
    try {
      await updateProject.mutateAsync({
        id: selectedProjectId,
        ...data,
        due_date: data.due_date || null,
      });
      setShowProjectForm(false);
      setEditingProject(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCreateTask = async (data: any) => {
    if (!selectedProjectId) return;
    try {
      await createTask.mutateAsync({
        ...data,
        project_id: selectedProjectId,
        description: data.description || "",
        assignee_email: data.assignee_email || "",
        due_date: data.due_date || null,
      });
      setShowTaskForm(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!selectedTask) return;
    try {
      const updatedTask = await updateTask.mutateAsync({
        id: selectedTask.id,
        ...data,
        due_date: data.due_date || null,
      });
      setShowTaskForm(false);
      setEditingTask(false);
      setSelectedTask(updatedTask);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    updateTask.mutateAsync({ id: taskId, status });
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      await deleteTask.mutateAsync(selectedTask.id);
      setSelectedTask(null);
      setView("project-detail");
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleAddComment = (content: string, authorEmail: string) => {
    if (!selectedTask) return;
    createComment.mutateAsync({
      task_id: selectedTask.id,
      content,
      author_email: authorEmail,
    });
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setView("project-detail");
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setView("projects");
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setView("task-detail");
  };

  const handleBackToProject = () => {
    setSelectedTask(null);
    setView("project-detail");
  };

  if (orgsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        organizations={organizations}
        selectedOrg={selectedOrg}
        onSelectOrg={setSelectedOrg}
        onCreateOrg={() => setShowOrgForm(true)}
      />

      <main className="container px-4 py-8">
        {view === "projects" && selectedOrg && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening in {selectedOrg.name}
              </p>
            </div>

            <ProjectStats projects={projects} />

            <ProjectList
              projects={projects}
              isLoading={projectsLoading}
              onProjectClick={handleProjectClick}
              onCreateProject={() => setShowProjectForm(true)}
            />
          </div>
        )}

        {view === "project-detail" && project && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToProjects}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-foreground">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={project.status} size="sm" />
                  {project.description && (
                    <span className="text-sm text-muted-foreground">
                      — {project.description}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingProject(true);
                  setShowProjectForm(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Project
              </Button>
            </div>

            <TaskBoard
              tasks={tasks}
              isLoading={tasksLoading}
              onTaskClick={handleTaskClick}
              onCreateTask={() => setShowTaskForm(true)}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          </div>
        )}

        {view === "task-detail" && selectedTask && (
          <div className="max-w-2xl animate-fade-in">
            <TaskDetail
              task={selectedTask}
              comments={comments}
              isLoadingComments={commentsLoading}
              onBack={handleBackToProject}
              onEdit={() => {
                setEditingTask(true);
                setShowTaskForm(true);
              }}
              onDelete={handleDeleteTask}
              onAddComment={handleAddComment}
            />
          </div>
        )}

        {!selectedOrg && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Welcome to ProjectHub
            </h2>
            <p className="text-muted-foreground mb-4">
              Create or select an organization to get started
            </p>
            <Button onClick={() => setShowOrgForm(true)}>
              Create Organization
            </Button>
          </div>
        )}
      </main>

      <OrganizationForm
        open={showOrgForm}
        onOpenChange={setShowOrgForm}
        onSubmit={handleCreateOrg}
        isLoading={createOrg.isPending}
      />

      <ProjectForm
        open={showProjectForm}
        onOpenChange={(open) => {
          setShowProjectForm(open);
          if (!open) setEditingProject(false);
        }}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        initialData={editingProject && project ? project : undefined}
        isLoading={createProject.isPending || updateProject.isPending}
      />

      <TaskForm
        open={showTaskForm}
        onOpenChange={(open) => {
          setShowTaskForm(open);
          if (!open) setEditingTask(false);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask && selectedTask ? selectedTask : undefined}
        isLoading={createTask.isPending || updateTask.isPending}
      />
    </div>
  );
};

export default Index;
