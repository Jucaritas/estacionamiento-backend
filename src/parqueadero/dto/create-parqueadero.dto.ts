// src/parqueadero/dto/create-parqueadero.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateParqueaderoDto {
  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  placa: string;
}