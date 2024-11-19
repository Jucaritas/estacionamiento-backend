import { ApiProperty } from '@nestjs/swagger';
import { Min, IsString, IsNumber, MaxLength, MinLength } from "class-validator";

export class CreateTipoVehiculoDto {
    @ApiProperty({
        description: 'Descripción del tipo de vehículo',
        example: 'Automóvil'
    })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'La descripción no puede tener más de 50 caracteres' })
    descripcion: string;

    @ApiProperty({
        description: 'Tarifa del tipo de vehículo',
        example: 100
    })
    @IsNumber({}, { message: 'La tarifa debe ser un número' })
    @Min(0, { message: 'La tarifa no puede ser negativa' })
    tarifa: number;
}
