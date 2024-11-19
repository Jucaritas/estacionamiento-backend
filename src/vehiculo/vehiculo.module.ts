import { Module } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { VehiculosController } from './vehiculo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VehiculosController],
  providers: [VehiculoService],
  exports: [VehiculoService],
})
export class VehiculoModule {}
