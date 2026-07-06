// Custom error class for API errors
export class ApiError extends Error {
  // Stores an HTTP status code with the error message.
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}
