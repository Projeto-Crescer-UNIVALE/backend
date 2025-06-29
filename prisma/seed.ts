import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  const senhaCriptografada = await bcrypt.hash('admin', 10);

  await prisma.perfil.upsert({
    where: { nome: 'Administrador' },
    update: {},
    create: { nome: 'Administrador' },
  });
  await prisma.perfil.create({
    data: {
      nome: 'Professor',
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
  await prisma.programaSocial.upsert({
    where: { nome: 'Programa Bolsa Família' },
    update: {},
    create: { nome: 'Programa Bolsa Família' },
  });
  await prisma.programaSocial.create({
    data: {
      nome: 'BPC/LOAS',
    },
  });
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
