import { Prisma } from 'generated/prisma';

export type Funcionario = Prisma.FuncionarioGetPayload<{
  omit: { senha: true };
}>;
