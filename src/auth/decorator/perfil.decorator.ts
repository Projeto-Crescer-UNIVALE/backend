import { SetMetadata } from '@nestjs/common';

export const PerfilRequired = (...perfis: string[]) =>
  SetMetadata('perfil', perfis);
