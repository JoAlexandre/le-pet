'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `users` MODIFY COLUMN `role` ENUM('ADMIN', 'TUTOR', 'COMPANY', 'PROFESSIONAL') NULL",
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `users` MODIFY COLUMN `role` ENUM('TUTOR', 'COMPANY', 'PROFESSIONAL') NULL",
    );
  },
};
