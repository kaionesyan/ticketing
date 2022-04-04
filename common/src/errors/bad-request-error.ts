import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  serializeErrors() {
    return [
      { message: this.message }
    ]
  }

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }


}