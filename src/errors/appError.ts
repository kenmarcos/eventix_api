class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number = 400, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default AppError;
