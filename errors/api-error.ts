export class ApiError extends Error {
  status?: number;
  responseData?: any;

  constructor(message: string, status?: number, responseData?: any) {
    super(message);
    this.status = status;
    this.responseData = responseData;
  }
}