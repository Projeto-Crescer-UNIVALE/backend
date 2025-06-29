import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';

export interface FuncionarioAtualInterface {
  id_funcionario: number;
}

export const FuncionarioAtual = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (req[REQUEST_TOKEN_PAYLOAD_KEY].sub)
      return {
        id_funcionario: req[REQUEST_TOKEN_PAYLOAD_KEY].sub,
      } as FuncionarioAtualInterface;

    throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
  },
);
