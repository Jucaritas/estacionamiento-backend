-- AlterTable
ALTER TABLE `parqueadero` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `tipovehiculo` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `vehiculo` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;
