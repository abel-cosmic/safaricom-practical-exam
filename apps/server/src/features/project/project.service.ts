import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import {
  CreateProjectDto,
  UpdateProjectDto,
  QueryProjectsDto,
  ProjectWithTasks,
  ProjectListResponse,
} from "./project.dto";

export class ProjectService {
  async findAll(query: QueryProjectsDto): Promise<ProjectListResponse> {
    const where: any = {};

    if (query.name) {
      where.name = {
        contains: query.name,
        mode: "insensitive",
      };
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          tasks: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects: projects as ProjectWithTasks[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ProjectWithTasks> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return project as ProjectWithTasks;
  }

  async create(data: CreateProjectDto): Promise<ProjectWithTasks> {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
      include: {
        tasks: true,
      },
    });

    return project as ProjectWithTasks;
  }

  async update(id: string, data: UpdateProjectDto): Promise<ProjectWithTasks> {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new Error("Project not found");
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) {
      updateData.description =
        data.description === null ? null : data.description;
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        tasks: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return project as ProjectWithTasks;
  }

  async delete(id: string): Promise<void> {
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new Error("Project not found");
    }

    await prisma.project.delete({
      where: { id },
    });
  }
}

export const projectService = new ProjectService();
