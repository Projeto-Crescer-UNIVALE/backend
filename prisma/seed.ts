import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  const senhaCriptografada = await bcrypt.hash('admin', 10);

  await prisma.perfil.create({
    data: {
      nome: 'Administrador',
    },
  });
  await prisma.funcionario.create({
    data: {
      nome: 'admin',
      email: 'admin@univale.br',
      senha: senhaCriptografada,
      telefone: '12345678910',
      ativo: true,
      id_perfil: 1,
    },
  });
  await prisma.programaSocial.create({
    data: {
      nome: 'Projeto Crescer',
    },
  });
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
