import { prisma } from "@/lib/prisma";
import {
  CreateTaskDto,
  UpdateTaskDto,
  QueryTasksDto,
  TaskWithProject,
  TaskListResponse,
} from "./task.dto";

export class TaskService {
  async findAll(query: QueryTasksDto): Promise<TaskListResponse> {
    const where: any = {};

    if (query.projectId) {
      where.projectId = query.projectId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.title) {
      where.title = {
        contains: query.title,
        mode: "insensitive",
      };
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks: tasks as TaskWithProject[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<TaskWithProject> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task as TaskWithProject;
  }

  async create(data: CreateTaskDto): Promise<TaskWithProject> {
    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const task = await prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        status: data.status || "OPEN",
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });

    return task as TaskWithProject;
  }

  async update(id: string, data: UpdateTaskDto): Promise<TaskWithProject> {
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.status !== undefined) updateData.status = data.status;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });

    return task as TaskWithProject;
  }

  async delete(id: string): Promise<void> {
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    await prisma.task.delete({
      where: { id },
    });
  }
}

export const taskService = new TaskService();

