import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PerfilRequired } from 'src/auth/decorator/perfil.decorator';
import { Perfil } from 'src/common/perfil.enum';

@PerfilRequired(Perfil.ADMINISTRADOR)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getOverview() {
    return this.dashboardService.getOverview();
  }
}
