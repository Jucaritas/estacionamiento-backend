import { Module } from '@nestjs/common';
import { TipoVehiculoService } from './tipo-vehiculo.service';
import { TipoVehiculoController } from './tipo-vehiculo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipoVehiculoController],
  providers: [TipoVehiculoService],
})
export class TipoVehiculoModule {}
