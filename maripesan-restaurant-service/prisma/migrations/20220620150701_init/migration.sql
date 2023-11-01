-- DropForeignKey
ALTER TABLE `restaurants` DROP FOREIGN KEY `restaurants_restaurantCategoryId_fkey`;

-- AlterTable
ALTER TABLE `restaurants` MODIFY `restaurantCategoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `restaurants` ADD CONSTRAINT `restaurants_restaurantCategoryId_fkey` FOREIGN KEY (`restaurantCategoryId`) REFERENCES `restaurant_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
