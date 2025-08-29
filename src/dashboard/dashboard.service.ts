import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const alunosAtivos = await this.prisma.aluno.count({
      where: { ativo: true, excluido_em: null },
    });

    const oficinasAtivas = await this.prisma.oficina.count({
      where: { status: true, excluido_em: null },
    });

    const usuariosAtivos = await this.prisma.funcionario.count({
      where: { ativo: true, excluido_em: null },
    });

    return {
      alunosAtivos,
      oficinasAtivas,
      usuariosAtivos,
    };
  }
}
