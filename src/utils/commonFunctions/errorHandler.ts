import {isCelebrateError} from 'celebrate';
import {STATUS_MSG} from '../constants/errorCodes';
import {NextFunction, Request, Response} from 'express';

export const errorHandling = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (isCelebrateError(err)) {
    next();
  } else {
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

export const sendErrorResponse = (error: any) => {
  switch (error.name) {
    case 'MongoError': {
      if (error.code == 11000) {
        return {
          statusCode: 400,
          success: error.success ? error.success : false,
          message:
            'This' +
            error.errmsg.split(':')[2].split('_')[0] +
            ' is already registered.',
          type: 'MongoError',
        };
      } else {
        return {
          statusCode: 500,
          success: false,
          message: STATUS_MSG.ERROR.IMP_ERROR.message,
        };
      }
    }
    case 'ValidationError': {
      return {
        statusCode: 400,
        success: false,
        message: error.message,
        type: 'ValidationError',
      };
    }
    case 'MongooseError': {
      return {
        statusCode: 400,
        success: false,
        message: error.message,
        type: 'MongooseError',
      };
    }
    default: {
      switch (error.type) {
        case 'DB_ERROR':
        case 'IMP_ERROR': {
          return {
            statusCode: error.statusCode ? error.statusCode : 500,
            success: false,
            message: error.message,
            type: 'DB_ERROR',
          };
        }
        default: {
          return {
            statusCode: error.statusCode ? error.statusCode : 400,
            success: error.success,
            message: error.message,
            type: error.type,
          };
        }
      }
    }
  }
};
