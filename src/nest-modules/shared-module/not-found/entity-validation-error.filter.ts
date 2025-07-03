import { NotFoundError } from '@core/shared/domain/error/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.errors';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { union } from 'lodash'
import { Response } from 'express';

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status = 422;

    response.status(status).json({
      statusCode: status,
      error: 'Unprocessable Entity',
      message: union(
        ...exception.errors.reduce(
          (acc, error) =>
            acc.concat(
              typeof error === 'string' ? [[error]] : Object.values(error)
            ), []
        )
      )
    });
  }
}
