"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { useProjects } from "@/hooks/use-projects";
import { Pencil, Trash2, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/api/project.api";
import { UserButton } from "@daveyplate/better-auth-ui";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const projects = data?.data || [];

  const handleViewTasks = (projectId: string) => {
    router.push(`/projects/${projectId}/tasks`);
  };

  return (
    <AuthGuard>
      <UserButton/>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your projects and tasks
            </p>
          </div>
          <CreateProjectDialog />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading projects...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-destructive">
              Error loading projects. Please try again.
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No projects yet. Create your first project to get started.
                </p>
                <CreateProjectDialog />
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          {project.name}
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {project.description || (
                            <span className="text-muted-foreground">
                              No description
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{project.tasks.length}</TableCell>
                        <TableCell>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewTasks(project.id)}
                              title="View Tasks"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingProject(project)}
                              title="Edit Project"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingProject(project)}
                              title="Delete Project"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        {editingProject && (
          <EditProjectDialog
            project={editingProject}
            open={!!editingProject}
            onOpenChange={(open) => !open && setEditingProject(null)}
          />
        )}

        {deletingProject && (
          <DeleteProjectDialog
            project={deletingProject}
            open={!!deletingProject}
            onOpenChange={(open) => !open && setDeletingProject(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}

