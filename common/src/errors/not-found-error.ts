import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  serializeErrors(): { message: string; field?: string | undefined; }[] {
    return [{ message: 'Not Found' }];
  }

  constructor() {
    super('Route not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}