-- DropForeignKey
ALTER TABLE `menu_categories` DROP FOREIGN KEY `menu_categories_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `menus` DROP FOREIGN KEY `menus_menuCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `restaurant_photos` DROP FOREIGN KEY `restaurant_photos_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `schedules` DROP FOREIGN KEY `schedules_restaurantId_fkey`;

-- DropForeignKey
ALTER TABLE `withdraws` DROP FOREIGN KEY `withdraws_restaurantId_fkey`;

-- AddForeignKey
ALTER TABLE `menu_categories` ADD CONSTRAINT `menu_categories_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menus` ADD CONSTRAINT `menus_menuCategoryId_fkey` FOREIGN KEY (`menuCategoryId`) REFERENCES `menu_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurant_photos` ADD CONSTRAINT `restaurant_photos_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `withdraws` ADD CONSTRAINT `withdraws_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
