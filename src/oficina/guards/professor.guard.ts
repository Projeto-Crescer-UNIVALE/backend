import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class ProfessorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // Apenas usuários com perfil 'Professor' podem acessar
    return req.user?.perfil?.nome === 'Professor';
  }
}