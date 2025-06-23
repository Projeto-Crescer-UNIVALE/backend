import { SetMetadata } from '@nestjs/common';
import { Perfil } from 'src/common/perfil.enum';

export const PerfilRequired = (...perfis: Perfil[]) =>
  SetMetadata('perfil', perfis);
