/* (The MIT License)
Copyright (c) 2017-2023 Kamil Mysliwiec <https://kamilmysliwiec.com> */

// This is adopted from https://github.com/nestjs/nest
import {HttpStatus} from './HttpStatus';
import {HttpException} from './HttpException';
import type {HttpExceptionOptions} from './HttpException';

export class BadRequestException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions: string | HttpExceptionOptions = 'Bad Request',
  ) {
    const {description, httpExceptionOptions} =
      HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

    super(
      HttpException.createBody(objectOrError, description, HttpStatus.BAD_REQUEST),
      HttpStatus.BAD_REQUEST,
      httpExceptionOptions,
    );
  }
}
