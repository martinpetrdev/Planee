import { HttpException } from "@nestjs/common";

export class DomainException extends HttpException {
  constructor(statusCode: number, response: string | Record<string, any>) {
    super(response, statusCode);
  }
}
