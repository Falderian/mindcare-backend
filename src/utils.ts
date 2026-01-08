import {
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      ...options,
      exceptionFactory: (validationErrors = []) => {
        const formatted = {};
        validationErrors.forEach((err) => {
          formatted[err.property] = Object.values(err.constraints ?? {});
        });
        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          messages: formatted,
        });
      },
    });
  }
}
