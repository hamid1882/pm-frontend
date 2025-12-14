import { Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './ProjectCard';
import { ProjectWithStats } from '@/types';

interface ProjectListProps {
  projects: ProjectWithStats[];
  isLoading: boolean;
  onProjectClick: (projectId: string) => void;
  onCreateProject: () => void;
}

export function ProjectList({ projects, isLoading, onProjectClick, onCreateProject }: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-lg border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No projects yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create your first project to get started
        </p>
        <Button onClick={onCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Projects</h2>
          <p className="text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProjectCard
              project={project}
              onClick={() => onProjectClick(project.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
