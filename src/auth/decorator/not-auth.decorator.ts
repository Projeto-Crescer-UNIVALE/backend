import { SetMetadata } from '@nestjs/common';

export const IS_PUBLICK_KEY = 'isPublic';
export const NotAuth = () => SetMetadata(IS_PUBLICK_KEY, true);
