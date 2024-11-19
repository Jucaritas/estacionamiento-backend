import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TipoVehiculoModule } from './tipo-vehiculo/tipo-vehiculo.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { ParqueaderoModule } from './parqueadero/parqueadero.module';

@Module({
  imports: [PrismaModule, TipoVehiculoModule, VehiculoModule, ParqueaderoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
