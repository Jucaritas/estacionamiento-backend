import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVehiculoDto {
    @ApiProperty({
        description: 'Placa del vehiculo',
        uniqueItems: true,
    })
    @IsString()
    @IsNotEmpty()
    placa: string;

    @ApiProperty({
        description: 'Modelo del vehiculo',
    })
    @IsString()
    @IsNotEmpty()
    modelo: string;

    @ApiProperty({
        description: 'Marca del vehiculo',
    })
    @IsString()
    @IsNotEmpty()
    marca: string;

    @ApiProperty({
        description: 'Clave del tipo de vehiculo',
    })
    @IsString()
    @IsNotEmpty()
    cveTipoVehiculo: string;
}