"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { useTasks } from "@/hooks/use-tasks";
import { useProject } from "@/hooks/use-projects";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import type { Task } from "@/lib/api/task.api";
import { UserButton } from "@daveyplate/better-auth-ui";

export default function TasksPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useTasks({ projectId });
  const { data: projectData, isLoading: projectLoading } =
    useProject(projectId);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const tasks = tasksData?.data || [];
  const project = projectData?.data;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "DONE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <AuthGuard>
      <UserButton />
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {projectLoading ? "Loading..." : project?.name || "Tasks"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {project?.description || "Manage tasks for this project"}
            </p>
          </div>
          <CreateTaskDialog projectId={projectId} />
        </div>

        {tasksLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading tasks...</div>
          </div>
        )}

        {tasksError && (
          <div className="flex items-center justify-center py-12">
            <div className="text-destructive">
              Error loading tasks. Please try again.
            </div>
          </div>
        )}

        {!tasksLoading && !tasksError && (
          <>
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No tasks yet. Create your first task to get started.
                </p>
                <CreateTaskDialog projectId={projectId} />
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                              task.status
                            )}`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(task.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingTask(task)}
                              title="Edit Task"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingTask(task)}
                              title="Delete Task"
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

        {editingTask && (
          <EditTaskDialog
            task={editingTask}
            open={!!editingTask}
            onOpenChange={(open) => !open && setEditingTask(null)}
          />
        )}

        {deletingTask && (
          <DeleteTaskDialog
            task={deletingTask}
            open={!!deletingTask}
            onOpenChange={(open) => !open && setDeletingTask(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
