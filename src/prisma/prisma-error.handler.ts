import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '../../generated/prisma/runtime/library';

export class PrismaErrorHandler {
  static handle(error: unknown, context: string = 'Operation'): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          const field = (error.meta?.target as string[])?.join(', ') || 'field';
          throw new ConflictException(`${context}: ${field} already exists`);

        case 'P2003':
          throw new NotFoundException(`${context}: Related record not found`);

        case 'P2025':
          throw new NotFoundException(`${context}: Record to update not found`);

        case 'P2000':
          throw new BadRequestException(`${context}: Invalid value provided`);

        default:
          console.error(`[${context}] Prisma error ${error.code}:`, error);
          throw new InternalServerErrorException(`${context} failed`);
      }
    }

    if (error instanceof PrismaClientValidationError) {
      throw new BadRequestException(`${context}: Invalid input data`);
    }

    console.error(`[${context}] Unexpected error:`, error);
    throw new InternalServerErrorException(
      `${context} failed due to server error`,
    );
  }
}
