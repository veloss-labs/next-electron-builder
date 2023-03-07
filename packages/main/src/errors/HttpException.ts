/* (The MIT License)
Copyright (c) 2017-2023 Kamil Mysliwiec <https://kamilmysliwiec.com> */

// This is adopted from https://github.com/nestjs/nest

import {Logger} from '~/logging/logger';
import {isObject, isString} from '~/utils/assertion';

export interface HttpExceptionOptions {
  cause?: Error;
  description?: string;
}

export interface DescriptionAndOptions {
  description?: string;
  httpExceptionOptions?: HttpExceptionOptions;
}

export class HttpException extends Error {
  constructor(
    private readonly response: string | Record<string, unknown>,
    private readonly status: number,
    private readonly options?: HttpExceptionOptions,
  ) {
    super();
    this.initMessage();
    this.initName();
    this.initCause();
  }

  public cause?: Error | undefined;

  /**
   * Configures error chaining support
   *
   * See:
   * - https://nodejs.org/en/blog/release/v16.9.0/#error-cause
   * - https://github.com/microsoft/TypeScript/issues/45167
   */
  public initCause(): void {
    if (this.options?.cause) {
      this.cause = this.options.cause;
      return;
    }

    if (this.response instanceof Error) {
      Logger.warn(
        'DEPRECATED! Passing the error cause as the first argument to HttpException constructor is deprecated. You should use the "options" parameter instead: new HttpException("message", 400, { cause: new Error("Some Error") }) ',
      );
      this.cause = this.response;
    }
  }

  public initMessage() {
    if (isString(this.response)) {
      this.message = this.response;
    } else if (
      isObject(this.response) &&
      isString((this.response as Record<string, any>).message)
    ) {
      this.message = (this.response as Record<string, any>).message;
    } else if (this.constructor) {
      this.message = this.constructor.name.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' ') ?? 'Error';
    }
  }

  public initName(): void {
    this.name = this.constructor.name;
  }

  public getResponse(): string | object {
    return this.response;
  }

  public getStatus(): number {
    return this.status;
  }

  public static createBody(
    objectOrErrorMessage: object | string,
    description?: string,
    statusCode?: number,
  ) {
    if (!objectOrErrorMessage) {
      return {statusCode, message: description};
    }
    return isObject(objectOrErrorMessage) && !Array.isArray(objectOrErrorMessage)
      ? objectOrErrorMessage
      : {statusCode, message: objectOrErrorMessage, error: description};
  }

  public static getDescriptionFrom(
    descriptionOrOptions: string | HttpExceptionOptions,
  ): string | undefined {
    return isString(descriptionOrOptions)
      ? descriptionOrOptions
      : descriptionOrOptions?.description;
  }

  public static getHttpExceptionOptionsFrom(
    descriptionOrOptions: string | HttpExceptionOptions,
  ): HttpExceptionOptions {
    return isString(descriptionOrOptions) ? {} : descriptionOrOptions;
  }

  /**
   * Utility method used to extract the error description and httpExceptionOptions from the given argument.
   * This is used by inheriting classes to correctly parse both options.
   * @returns the error description and the httpExceptionOptions as an object.
   */
  public static extractDescriptionAndOptionsFrom(
    descriptionOrOptions: string | HttpExceptionOptions,
  ): DescriptionAndOptions {
    const description = this.getDescriptionFrom(descriptionOrOptions);

    const httpExceptionOptions = this.getHttpExceptionOptionsFrom(descriptionOrOptions);

    return {
      description,
      httpExceptionOptions,
    };
  }
}
