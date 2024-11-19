// src/parqueadero/parqueadero.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Put,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ParqueaderoService } from './parqueadero.service';
import { CreateParqueaderoDto } from './dto/create-parqueadero.dto';

@ApiTags('Parqueadero')
@Controller('parqueadero')
export class ParqueaderoController {
  constructor(private readonly parqueaderoService: ParqueaderoService) {}

  @Post("entrada")
  @ApiOperation({ summary: 'Registrar entrada de vehículo' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Entrada registrada exitosamente.' 
  })
  async create(@Body() createParqueaderoDto: CreateParqueaderoDto) {
    return this.parqueaderoService.create(createParqueaderoDto);
  }

  @Get('historial')
  @ApiOperation({ summary: 'Obtener lista de registros de parqueadero' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'fechaInicio', required: false, type: String })
  @ApiQuery({ name: 'fechaFin', required: false, type: String })
  @ApiQuery({ name: 'placa', required: false, type: String })
  @ApiQuery({ name: 'conSalida', required: false, type: Boolean })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('placa') placa?: string,
    @Query('conSalida') conSalida?: string,
  ) {
    const parsedSkip = skip ? parseInt(skip, 10) : undefined;
    const parsedTake = take ? parseInt(take, 10) : undefined;
    let parsedFechaInicio: Date | undefined;
    let parsedFechaFin: Date | undefined;

    if (fechaInicio) {
      parsedFechaInicio = new Date(fechaInicio);
      if (isNaN(parsedFechaInicio.getTime())) {
        throw new BadRequestException('Fecha de inicio inválida');
      }
    }

    if (fechaFin) {
      parsedFechaFin = new Date(fechaFin);
      if (isNaN(parsedFechaFin.getTime())) {
        throw new BadRequestException('Fecha de fin inválida');
      }
    }

    const parsedConSalida = conSalida ? conSalida === 'true' : undefined;

    return this.parqueaderoService.findAll({
      skip: parsedSkip,
      take: parsedTake,
      fechaInicio: parsedFechaInicio,
      fechaFin: parsedFechaFin,
      placa,
      conSalida: parsedConSalida,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro específico de parqueadero' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parqueaderoService.findOne(id);
  }

  @Put('salida/:id')
  @ApiOperation({ summary: 'Registrar salida de vehículo' })
  async registrarSalida(@Param('id', ParseIntPipe) id: number) {
    return this.parqueaderoService.registrarSalida(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar registro de parqueadero (soft delete)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.parqueaderoService.softDelete(id);
  }

  @Get('estadisticas/resumen')
  @ApiOperation({ summary: 'Obtener estadísticas del parqueadero' })
  @ApiQuery({ name: 'fechaInicio', required: true, type: String })
  @ApiQuery({ name: 'fechaFin', required: true, type: String })
  async getEstadisticas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const parsedFechaInicio = new Date(fechaInicio);
    const parsedFechaFin = new Date(fechaFin);

    if (isNaN(parsedFechaInicio.getTime()) || isNaN(parsedFechaFin.getTime())) {
      throw new BadRequestException('Fechas inválidas');
    }

    return this.parqueaderoService.getEstadisticas(parsedFechaInicio, parsedFechaFin);
  }
}