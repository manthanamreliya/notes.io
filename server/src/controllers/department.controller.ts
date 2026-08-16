import { Request, Response, NextFunction } from "express";
import { DepartmentService } from "../services/department.service";
import { ApiResponse } from "../utils/ApiResponse";

export class DepartmentController {
  private departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  /**
   * POST /api/v1/departments
   * Create a department (admin only).
   */
  public createDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // TODO: Call departmentService.createDepartment
      const department = await this.departmentService.createDepartment(req.body);
      ApiResponse.success(res, 201, "Department created successfully", department);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/departments
   * Get list of all departments.
   */
  public getDepartments = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // TODO: Call departmentService.getAllDepartments
      const departments = await this.departmentService.getAllDepartments();
      ApiResponse.success(res, 200, "Departments retrieved successfully", departments);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/departments/:id
   * Delete a department (admin only).
   */
  public deleteDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      // TODO: Call departmentService.deleteDepartment
      await this.departmentService.deleteDepartment(id);
      ApiResponse.success(res, 200, "Department deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
