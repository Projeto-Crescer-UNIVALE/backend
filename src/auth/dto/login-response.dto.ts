export class LoginResponseDto {
  accessToken: string;
  funcionario: {
    id: number;
    nome: string;
    email: string;
    perfil: string;
  };
  expiresAt: Date;
}
