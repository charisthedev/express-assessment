import { NextFunction, Request, Response } from 'express';
import Joi, { ObjectSchema } from 'joi';
import { AppError } from '../errors/AppError';

type ValidationTarget = 'body' | 'params' | 'query';

export const validate = (schema: ObjectSchema, target: ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((detail: Joi.ValidationErrorItem) => detail.message);
      next(new AppError('Validation error', 400, details));
      return;
    }

    req[target] = value;
    next();
  };
};
