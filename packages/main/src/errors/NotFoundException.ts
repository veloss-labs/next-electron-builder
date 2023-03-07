/* (The MIT License)
Copyright (c) 2017-2023 Kamil Mysliwiec <https://kamilmysliwiec.com> */

// This is adopted from https://github.com/nestjs/nest
import {HttpStatus} from './HttpStatus';
import {HttpException} from './HttpException';
import type {HttpExceptionOptions} from './HttpException';

export class NotFoundException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions: string | HttpExceptionOptions = 'Not Found',
  ) {
    const {description, httpExceptionOptions} =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

    super(
      HttpException.createBody(objectOrError, description, HttpStatus.NOT_FOUND),
      HttpStatus.NOT_FOUND,
      httpExceptionOptions,
    );
  }
}
