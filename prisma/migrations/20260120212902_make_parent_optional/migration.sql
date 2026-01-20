-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_parentId_fkey`;

-- DropIndex
DROP INDEX `Student_parentId_fkey` ON `student`;

-- AlterTable
ALTER TABLE `student` MODIFY `parentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Parent`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
