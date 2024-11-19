import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TipoVehiculoService } from './tipo-vehiculo.service';
import { CreateTipoVehiculoDto } from './dto/create-tipo-vehiculo.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tipos de Vehiculo')
@Controller('tipos-vehiculo')
export class TipoVehiculoController {
  constructor(private readonly tipoVehiculoService: TipoVehiculoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de vehículo' })
  @ApiResponse({ status: 201, description: 'Tipo de vehículo creado exitosamente' })
  create(@Body() createTipoVehiculoDto: CreateTipoVehiculoDto) {
    return this.tipoVehiculoService.create(createTipoVehiculoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de vehículo' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de vehículo' })
  findAll() {
    return this.tipoVehiculoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de vehículo por ID' })
  @ApiResponse({ status: 200, description: 'Tipo de vehículo encontrado' })
  @ApiResponse({ status: 404, description: 'Tipo de vehículo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoVehiculoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de vehículo' })
  @ApiResponse({ status: 200, description: 'Tipo de vehículo actualizado' })
  @ApiResponse({ status: 404, description: 'Tipo de vehículo no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoVehiculoDto: CreateTipoVehiculoDto,
  ) {
    return this.tipoVehiculoService.update(id, updateTipoVehiculoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de vehículo' })
  @ApiResponse({ status: 200, description: 'Tipo de vehículo eliminado' })
  @ApiResponse({ status: 404, description: 'Tipo de vehículo no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoVehiculoService.remove(id);
  }
}