export class VerificaTokenDto {
  token: string;
  tipoToken: 'primeiro_acesso' | 'redefinicao_senha';
}
