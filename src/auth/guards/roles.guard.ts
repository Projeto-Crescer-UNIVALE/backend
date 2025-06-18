import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TokenPayloadDto } from '../dto/token-payload.dto';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const token: TokenPayloadDto = request[REQUEST_TOKEN_PAYLOAD_KEY];
    return requiredRoles.includes(token.id_perfil);
  }
}
