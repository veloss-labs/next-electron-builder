/* (The MIT License)
Copyright (c) 2017-2023 Kamil Mysliwiec <https://kamilmysliwiec.com> */

// This is adopted from https://github.com/nestjs/nest
import {HttpStatus} from './HttpStatus';
import {HttpException} from './HttpException';
import type {HttpExceptionOptions} from './HttpException';

export class UnauthorizedException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions: string | HttpExceptionOptions = 'Unauthorized',
  ) {
    const {description, httpExceptionOptions} =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

    super(
      HttpException.createBody(objectOrError, description, HttpStatus.UNAUTHORIZED),
      HttpStatus.UNAUTHORIZED,
      httpExceptionOptions,
    );
  }
}
