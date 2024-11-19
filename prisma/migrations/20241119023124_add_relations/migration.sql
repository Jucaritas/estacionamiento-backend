/*
  Warnings:

  - You are about to drop the column `vehiculo` on the `parqueadero` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clave]` on the table `TipoVehiculo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[placa]` on the table `Vehiculo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `parqueadero` DROP COLUMN `vehiculo`,
    MODIFY `fechaSalida` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `Parqueadero_placa_idx` ON `Parqueadero`(`placa`);

-- CreateIndex
CREATE UNIQUE INDEX `TipoVehiculo_clave_key` ON `TipoVehiculo`(`clave`);

-- CreateIndex
CREATE UNIQUE INDEX `Vehiculo_placa_key` ON `Vehiculo`(`placa`);

-- CreateIndex
CREATE INDEX `Vehiculo_cveTipoVehiculo_idx` ON `Vehiculo`(`cveTipoVehiculo`);

-- AddForeignKey
ALTER TABLE `Vehiculo` ADD CONSTRAINT `Vehiculo_cveTipoVehiculo_fkey` FOREIGN KEY (`cveTipoVehiculo`) REFERENCES `TipoVehiculo`(`clave`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parqueadero` ADD CONSTRAINT `Parqueadero_placa_fkey` FOREIGN KEY (`placa`) REFERENCES `Vehiculo`(`placa`) ON DELETE RESTRICT ON UPDATE CASCADE;
