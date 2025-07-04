import { NotFoundError } from '@core/shared/domain/error/not-found.error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status = 404;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: 'Not Found',
    });
  }
}
