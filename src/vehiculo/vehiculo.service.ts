// src/vehiculos/vehiculos.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { Vehiculo, Prisma } from '@prisma/client';

@Injectable()
export class VehiculoService {
  constructor(private prisma: PrismaService) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    // Validar que la placa no exista
    const existingVehiculo = await this.prisma.vehiculo.findUnique({
      where: { placa: createVehiculoDto.placa },
    });

    if (existingVehiculo) {
      throw new BadRequestException(`Ya existe un vehículo con la placa ${createVehiculoDto.placa}`);
    }

    // Validar que el tipo de vehículo exista y no esté eliminado
    const tipoVehiculo = await this.prisma.tipoVehiculo.findFirst({
      where: {
        clave: createVehiculoDto.cveTipoVehiculo,
        deleted: false,
      },
    });

    if (!tipoVehiculo) {
      throw new BadRequestException(`El tipo de vehículo con clave ${createVehiculoDto.cveTipoVehiculo} no existe o está inactivo`);
    }

    // Crear el vehículo
    try {
      return await this.prisma.vehiculo.create({
        data: {
          ...createVehiculoDto,
          deleted: false,
        },
        include: {
          tipoVehiculo: true, // Incluir la información del tipo de vehículo en la respuesta
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('La placa del vehículo ya existe');
        }
      }
      throw error;
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.VehiculoWhereInput;
    orderBy?: Prisma.VehiculoOrderByWithRelationInput;
  }): Promise<Vehiculo[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.vehiculo.findMany({
      skip,
      take,
      where: {
        ...where,
        deleted: false, // Solo traer vehículos no eliminados
      },
      orderBy,
      include: {
        tipoVehiculo: true,
      },
    });
  }

  async findOne(id: number): Promise<Vehiculo> {
    const vehiculo = await this.prisma.vehiculo.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        tipoVehiculo: true,
      },
    });

    if (!vehiculo) {
      throw new NotFoundException(`No se encontró el vehículo con ID ${id}`);
    }

    return vehiculo;
  }

  async findByPlaca(placa: string): Promise<Vehiculo> {
    const vehiculo = await this.prisma.vehiculo.findFirst({
      where: {
        placa,
        deleted: false,
      },
      include: {
        tipoVehiculo: true,
      },
    });

    if (!vehiculo) {
      throw new NotFoundException(`No se encontró el vehículo con placa ${placa}`);
    }

    return vehiculo;
  }

  async update(id: number, updateData: Partial<CreateVehiculoDto>): Promise<Vehiculo> {
    // Verificar que el vehículo existe
    await this.findOne(id);

    // Si se está actualizando el tipo de vehículo, validar que existe
    if (updateData.cveTipoVehiculo) {
      const tipoVehiculo = await this.prisma.tipoVehiculo.findFirst({
        where: {
          clave: updateData.cveTipoVehiculo,
          deleted: false,
        },
      });

      if (!tipoVehiculo) {
        throw new BadRequestException(`El tipo de vehículo con clave ${updateData.cveTipoVehiculo} no existe o está inactivo`);
      }
    }

    try {
      return await this.prisma.vehiculo.update({
        where: { id },
        data: updateData,
        include: {
          tipoVehiculo: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('La placa del vehículo ya existe');
        }
      }
      throw error;
    }
  }

  async softDelete(id: number): Promise<Vehiculo> {
    // Verificar que el vehículo existe
    await this.findOne(id);

    return this.prisma.vehiculo.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }

  // Método helper para validar tipo de vehículo
  private async validateTipoVehiculo(clave: string): Promise<void> {
    const tipoVehiculo = await this.prisma.tipoVehiculo.findFirst({
      where: {
        clave,
        deleted: false,
      },
    });

    if (!tipoVehiculo) {
      throw new BadRequestException(`El tipo de vehículo con clave ${clave} no existe o está inactivo`);
    }
  }
}