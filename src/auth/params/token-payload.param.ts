import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export const TokenPayloadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContextHost) => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();
    return request[REQUEST_TOKEN_PAYLOAD_KEY];
  },
);
