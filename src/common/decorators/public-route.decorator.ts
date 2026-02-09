import { SetMetadata } from '@nestjs/common';

/**
 * @description This key is used to store the public route metadata
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @description This decorator is used to mark a route as public
 * @example @PublicRoute()
 */
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
