/**
 * Base Error class for custom errors.
 */
export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
  }
}
export class UnauthorizedError extends CustomError {
  constructor(message: string, statusCode: number = 401) {
    super(message, statusCode);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string, statusCode: number = 403) {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, statusCode: number = 404) {
    super(message, statusCode);
  }
}

/**
 * Error class for validation errors.
 */
export class ValidationError extends CustomError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
    this.name = "ValidationError";
  }
}

/**
 * Error class for authentication errors.
 */
export class AuthenticationError extends CustomError {
  constructor(message: string, statusCode: number = 401) {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

/**
 * Error class for authorization errors.
 */
export class AuthorizationError extends CustomError {
  constructor(message: string, statusCode: number = 403) {
    super(message, statusCode);
    this.name = "AuthorizationError";
  }
}

/**
 * Error class for server errors.
 */
export class ServerError extends CustomError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode);
    this.name = "ServerError";
  }
}

/**
 * Error class for conflicts (e.g., duplicate data).
 */
export class ConflictError extends CustomError {
  constructor(message: string, statusCode: number = 409) {
    super(message, statusCode);
    this.name = "ConflictError";
  }
}
