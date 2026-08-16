import { DepartmentModel, IDepartment } from "../models/Department.model";

export class DepartmentRepository {
  /**
   * Find department by unique name.
   */
  async findByName(name: string): Promise<IDepartment | null> {
    // TODO: DB Query - Find department by name
    return DepartmentModel.findOne({ name }).exec();
  }

  /**
   * Find department by ID.
   */
  async findById(id: string): Promise<IDepartment | null> {
    // TODO: DB Query - Find department by _id
    return DepartmentModel.findById(id).exec();
  }

  /**
   * Create a new department document.
   */
  async create(departmentData: Partial<IDepartment>): Promise<IDepartment> {
    // TODO: DB Query - Insert department record
    const department = new DepartmentModel(departmentData);
    return department.save();
  }

  /**
   * Retrieve all departments sorted by name.
   */
  async findAll(): Promise<IDepartment[]> {
    // TODO: DB Query - Find all departments
    return DepartmentModel.find().sort({ name: 1 }).exec();
  }

  /**
   * Delete a department by ID.
   */
  async deleteById(id: string): Promise<IDepartment | null> {
    // TODO: DB Query - Delete department document by _id
    return DepartmentModel.findByIdAndDelete(id).exec();
  }
}
