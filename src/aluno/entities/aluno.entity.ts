export class Aluno {
  id_aluno: number;
  nome: string;
  data_nascimento: Date;
  cpf: string;
  rg: string;
  nis: string;
  cep: string;
  bairro: string;
  rua: string;
  numero_casa: string;
  nome_mae: string;
  telefone: string;
  grupo_scfv: number;
  situacao_escolar: number;
  alergias?: string;
  necessidades_especiais?: string;
  medicamentos?: string;
  status: boolean;
}
