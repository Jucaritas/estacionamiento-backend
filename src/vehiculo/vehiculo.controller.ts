import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  HttpStatus,
  ParseIntPipe,
  BadRequestException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@ApiTags('Vehículos')
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo vehículo' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'El vehículo ha sido creado exitosamente.' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos o placa duplicada.' 
  })
  async create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de vehículos' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'placa', required: false, type: String })
  @ApiQuery({ name: 'marca', required: false, type: String })
  @ApiQuery({ name: 'modelo', required: false, type: String })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('placa') placa?: string,
    @Query('marca') marca?: string,
    @Query('modelo') modelo?: string,
  ) {
    // Validar y convertir parámetros de paginación
    const parsedSkip = skip ? parseInt(skip, 10) : undefined;
    const parsedTake = take ? parseInt(take, 10) : undefined;

    if (skip && isNaN(parsedSkip)) {
      throw new BadRequestException('El parámetro skip debe ser un número');
    }
    if (take && isNaN(parsedTake)) {
      throw new BadRequestException('El parámetro take debe ser un número');
    }

    // Construir objeto where para filtros
    const where = {
      ...(placa && { placa: { contains: placa } }),
      ...(marca && { marca: { contains: marca } }),
      ...(modelo && { modelo: { contains: modelo } }),
      deleted: false,
    };

    return this.vehiculosService.findAll({
      skip: parsedSkip,
      take: parsedTake,
      where,
      orderBy: { id: 'desc' }, // Ordenar por ID descendente
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un vehículo por ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vehículo encontrado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vehículo no encontrado.' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculosService.findOne(id);
  }

  @Get('placa/:placa')
  @ApiOperation({ summary: 'Obtener un vehículo por placa' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vehículo encontrado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vehículo no encontrado.' 
  })
  async findByPlaca(@Param('placa') placa: string) {
    return this.vehiculosService.findByPlaca(placa);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un vehículo' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vehículo actualizado exitosamente.' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos o placa duplicada.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vehículo no encontrado.' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehiculoDto: UpdateVehiculoDto
  ) {
    return this.vehiculosService.update(id, updateVehiculoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vehículo (soft delete)' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Vehículo eliminado exitosamente.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vehículo no encontrado.' 
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculosService.softDelete(id);
  }
}