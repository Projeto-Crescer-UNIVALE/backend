import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';

@Injectable()
export class PerfilGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredPerfis = this.reflector.get<string[]>(
      'perfil',
      context.getHandler(),
    );

    if (!requiredPerfis || requiredPerfis.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const userPayload = request[REQUEST_TOKEN_PAYLOAD_KEY];

    if (!userPayload) {
      throw new UnauthorizedException(
        'Dados do usuário não disponíveis. Certifique-se de er autenticado.',
      );
    }

    const userPerfil = userPayload.perfil;

    const hasPermission = requiredPerfis.includes(userPerfil);

    if (!hasPermission) {
      throw new UnauthorizedException(
        `Você nao tem permissão para acessar este recurso. Seu perfil atual é: ${userPerfil}. Perfis permitidos: ${requiredPerfis.join(', ')}`,
      );
    }

    return true;
  }
}
