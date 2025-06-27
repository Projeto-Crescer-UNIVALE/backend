import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';

export const UsuarioAtual = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (req[REQUEST_TOKEN_PAYLOAD_KEY].funcionario)
      return req[REQUEST_TOKEN_PAYLOAD_KEY].funcionario;

    throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
  },
);
