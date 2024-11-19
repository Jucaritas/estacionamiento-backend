import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoVehiculoDto } from './dto/create-tipo-vehiculo.dto';
import { TipoVehiculo } from '@prisma/client';

@Injectable()
export class TipoVehiculoService {
  constructor(private prisma: PrismaService) {}

  async create(createTipoVehiculoDto: CreateTipoVehiculoDto): Promise<TipoVehiculo> {
    return this.prisma.tipoVehiculo.create({
      data: createTipoVehiculoDto,
    });
  }

  async findAll(): Promise<TipoVehiculo[]> {
    return this.prisma.tipoVehiculo.findMany({
      where: {
        deleted: false,
      },
    });
  }

  async findOne(id: number): Promise<TipoVehiculo> {
    const tipoVehiculo = await this.prisma.tipoVehiculo.findFirst({
      where: {
        id,
        deleted: false,
      },
    });

    if (!tipoVehiculo) {
      throw new NotFoundException(`Tipo de vehículo con ID ${id} no encontrado`);
    }

    return tipoVehiculo;
  }

  async update(id: number, updateTipoVehiculoDto: CreateTipoVehiculoDto): Promise<TipoVehiculo> {
    await this.findOne(id); // Verificar si existe

    return this.prisma.tipoVehiculo.update({
      where: { id },
      data: updateTipoVehiculoDto,
    });
  }

  async remove(id: number): Promise<TipoVehiculo> {
    await this.findOne(id); // Verificar si existe

    return this.prisma.tipoVehiculo.update({
      where: { id },
      data: { deleted: true },
    });
  }
}