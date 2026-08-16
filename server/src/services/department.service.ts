import { DepartmentRepository } from "../repositories/department.repository";
import { CreateDepartmentDTO, DepartmentResponseDTO } from "../types/dtos/department.dto";
import { ApiError } from "../utils/ApiError";

export class DepartmentService {
  private departmentRepository: DepartmentRepository;

  constructor() {
    this.departmentRepository = new DepartmentRepository();
  }

  /**
   * Create a new department.
   */
  async createDepartment(dto: CreateDepartmentDTO): Promise<DepartmentResponseDTO> {
    if (!dto.name || typeof dto.name !== "string" || dto.name.trim().length === 0) {
      throw ApiError.badRequest("Department name is required.");
    }

    const trimmedName = dto.name.trim();
    const existing = await this.departmentRepository.findByName(trimmedName);
    if (existing) {
      return {
        id: (existing._id as any).toString(),
        name: existing.name,
        createdAt: existing.createdAt,
      };
    }

    const department = await this.departmentRepository.create({ name: trimmedName });
    return {
      id: (department._id as any).toString(),
      name: department.name,
      createdAt: department.createdAt,
    };
  }

  /**
   * Get list of all departments.
   */
  async getAllDepartments(): Promise<DepartmentResponseDTO[]> {
    const list = await this.departmentRepository.findAll();
    return list.map((dept) => ({
      id: (dept._id as any).toString(),
      name: dept.name,
      createdAt: dept.createdAt,
    }));
  }

  /**
   * Delete a department by ID.
   */
  async deleteDepartment(id: string): Promise<void> {
    const existing = await this.departmentRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Department not found.");
    }
    await this.departmentRepository.deleteById(id);
  }
}

