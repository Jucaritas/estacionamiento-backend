// src/parqueadero/parqueadero.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParqueaderoDto } from './dto/create-parqueadero.dto';
import { Parqueadero, Prisma, Vehiculo } from '@prisma/client';
import { VehiculoService } from 'src/vehiculo/vehiculo.service';

@Injectable()
export class ParqueaderoService {
  constructor(private prisma: PrismaService, private vehiculoService: VehiculoService ) {}

  async create(createParqueaderoDto: CreateParqueaderoDto): Promise<Parqueadero> {
    // Validar que el vehículo existe y no está eliminado
    let vehiculo: Vehiculo = undefined; 
     vehiculo = await this.prisma.vehiculo.findFirst({
      where: {
        placa: createParqueaderoDto.placa,
        deleted: false,
      },
      include: {
        tipoVehiculo: true,
      },
    });


    if (!vehiculo) {
      // Si no existe, crearlo
      vehiculo = await this.vehiculoService.create({
        placa: createParqueaderoDto.placa,
        cveTipoVehiculo: 'cm3nu5lqa0002fnf7zy5rgzx0',
        modelo: 'general', // Replace with actual model if available
        marca: 'general', // Replace with actual brand if available
      });
      
    }

    // Validar que no tenga una entrada activa sin salida
    const entradaActiva = await this.prisma.parqueadero.findFirst({
      where: {
        placa: createParqueaderoDto.placa,
        fechaSalida: null,
        deleted: false,
      },
    });

    if (entradaActiva) {
      throw new BadRequestException(`El vehículo con placa ${createParqueaderoDto.placa} ya tiene una entrada activa`);
    }

    // Crear registro de parqueadero
    try {
      return await this.prisma.parqueadero.create({
        data: {
          placa: createParqueaderoDto.placa,
          valor: 0, // El valor se calculará al registrar la salida
          deleted: false,
        },
        include: {
          vehiculo: {
            include: {
              tipoVehiculo: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Error al registrar la entrada al parqueadero');
      }
      throw error;
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    fechaInicio?: Date;
    fechaFin?: Date;
    placa?: string;
    conSalida?: boolean;
  }): Promise<{ data: Parqueadero[]; total: number }> {
    const { skip, take, fechaInicio, fechaFin, placa, conSalida } = params;

    const where: Prisma.ParqueaderoWhereInput = {
      deleted: false,
      ...(placa && { placa: { contains: placa } }),
      ...(fechaInicio && fechaFin && {
        fechaIngreso: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      }),
      ...(conSalida !== undefined && {
        fechaSalida: conSalida ? { not: null } : null,
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.parqueadero.findMany({
        skip,
        take,
        where,
        orderBy: {
          fechaIngreso: 'desc',
        },
        include: {
          vehiculo: {
            include: {
              tipoVehiculo: true,
            },
          },
        },
      }),
      this.prisma.parqueadero.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: number): Promise<Parqueadero> {
    const parqueadero = await this.prisma.parqueadero.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        vehiculo: {
          include: {
            tipoVehiculo: true,
          },
        },
      },
    });

    if (!parqueadero) {
      throw new NotFoundException(`No se encontró el registro de parqueadero con ID ${id}`);
    }

    return parqueadero;
  }

  async registrarSalida(id: number): Promise<Parqueadero> {
    const parqueadero = await this.prisma.parqueadero.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        vehiculo: {
          include: {
            tipoVehiculo: true,
          },
        },
      },
    });

    if (!parqueadero) {
      throw new NotFoundException(`No se encontró el registro de parqueadero con ID ${id}`);
    }

    if (parqueadero.fechaSalida) {
      throw new BadRequestException('Este vehículo ya tiene registrada su salida');
    }

    // Calcular el tiempo de estancia en horas
    const horasEstancia = Math.ceil(
      (new Date().getTime() - parqueadero.fechaIngreso.getTime()) / (1000 * 60 * 60)
    );

    // Calcular el valor según la tarifa del tipo de vehículo
    const valor = horasEstancia * parqueadero.vehiculo.tipoVehiculo.tarifa;

    return this.prisma.parqueadero.update({
      where: { id },
      data: {
        fechaSalida: new Date(),
        valor,
      },
      include: {
        vehiculo: {
          include: {
            tipoVehiculo: true,
          },
        },
      },
    });
  }

  async softDelete(id: number): Promise<Parqueadero> {
    await this.findOne(id);

    return this.prisma.parqueadero.update({
      where: { id },
      data: {
        deleted: true,
      },
    });
  }

  // Métodos auxiliares para reportes
  async getEstadisticas(fechaInicio: Date, fechaFin: Date) {
    const registros = await this.prisma.parqueadero.findMany({
      where: {
        fechaIngreso: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        fechaSalida: { not: null },
        deleted: false,
      },
      include: {
        vehiculo: {
          include: {
            tipoVehiculo: true,
          },
        },
      },
    });

    const totalIngresos = registros.reduce((sum, reg) => sum + reg.valor, 0);
    const vehiculosPorTipo = registros.reduce((acc, reg) => {
      const tipo = reg.vehiculo.tipoVehiculo.descripcion;
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRegistros: registros.length,
      totalIngresos,
      vehiculosPorTipo,
      promedioEstancia: registros.length ? 
        registros.reduce((sum, reg) => 
          sum + (reg.fechaSalida.getTime() - reg.fechaIngreso.getTime()) / (1000 * 60 * 60), 0
        ) / registros.length : 0,
    };
  }
}