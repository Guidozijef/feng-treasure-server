import { MiddlewareHandler } from 'hono';
import { error } from '../utils/response.js';

export const errorHandler = (): MiddlewareHandler => {
  return async (c, next) => {
    try {
      await next();
    } catch (err: any) {
      console.error('[Global Error]', err);
      return c.json(error(err.message || 'Internal Server Error', 500), 500);
    }
  };
};

export const notFoundHandler = (c: any) => {
  return c.json(error(`Route not found: ${c.req.path}`, 404), 404);
};
