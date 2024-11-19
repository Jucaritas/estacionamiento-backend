import { Module } from '@nestjs/common';
import { ParqueaderoService } from './parqueadero.service';
import { ParqueaderoController } from './parqueadero.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';

@Module({
  imports: [PrismaModule,VehiculoModule],
  controllers: [ParqueaderoController],
  providers: [ParqueaderoService],
})
export class ParqueaderoModule {}
