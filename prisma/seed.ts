import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  const senhaCriptografada = await bcrypt.hash('admin', 10);

  await prisma.perfil.upsert({
    where: { nome: 'Administrador' },
    update: {},
    create: { nome: 'Administrador' },
  });

  await prisma.perfil.upsert({
    where: { nome: 'Professor' },
    update: {},
    create: {
      nome: 'Professor',
    },
  });

  await prisma.funcionario.upsert({
    where: { email: 'admin@teste.br' },
    update: {},
    create: {
      nome: 'admin',
      email: 'admin@teste.br',
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

  await prisma.programaSocial.upsert({
    where: { nome: 'BPC/LOAS' },
    update: {},
    create: { nome: 'BPC/LOAS' },
  });
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
