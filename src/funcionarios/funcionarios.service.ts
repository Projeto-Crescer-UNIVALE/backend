import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FuncionariosService {
  constructor(private readonly prisma: PrismaService) {}
  private funcionarios: any[] = [];

  create(dto: CreateFuncionarioDto) {
    const novoFuncionario = {
      id_funcionario: Date.now(), // ID único simulado
      ...dto,
    };
    this.funcionarios.push(novoFuncionario);
    return novoFuncionario;
  }

  findAll() {
    return this.funcionarios;
  }

  findOne(id: number) {
    const funcionario = this.funcionarios.find(f => f.id_funcionario === id);
    if (!funcionario) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado.`);
    }
    return funcionario;
  }

  findByNome(nome: string) {
    const resultado = this.funcionarios.filter(func =>
      func.nome.toLowerCase().includes(nome.toLowerCase())
    );

    if (resultado.length === 0) {
      throw new NotFoundException(`Nenhum funcionário encontrado com o nome: ${nome}`);
    }

    return resultado;
  }

  update(id: number, dto: UpdateFuncionarioDto) {
    const index = this.funcionarios.findIndex(f => f.id_funcionario === id);
    if (index === -1) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado.`);
    }

    this.funcionarios[index] = {
      ...this.funcionarios[index],
      ...dto,
    };

    return this.funcionarios[index];
  }

  remove(id: number) {
    const index = this.funcionarios.findIndex(f => f.id_funcionario === id);
    if (index === -1) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado.`);
    }

    const removido = this.funcionarios.splice(index, 1);
    return removido[0];
  }
}
