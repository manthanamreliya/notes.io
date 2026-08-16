import { Response } from "express";

export interface IApiResponse<T = unknown> {
  success: true;
  statusCode: number;
  message: string;
  data?: T;
}

export class ApiResponse {
  public static success<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
  ): Response {
    const responsePayload: IApiResponse<T> = {
      success: true,
      statusCode,
      message,
      ...(data !== undefined && { data }),
    };
    return res.status(statusCode).json(responsePayload);
  }
}
