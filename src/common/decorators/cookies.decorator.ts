import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * @description This decorator is used to get the cookies from the request
 * @param data - (optional) The name of the cookie
 * @returns An object of cookies or the cookie value
 */

export const Cookies = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const cookies = request.cookies as Record<string, string> | undefined;
    if (!data) return cookies;
    return cookies?.[data];
  },
);
