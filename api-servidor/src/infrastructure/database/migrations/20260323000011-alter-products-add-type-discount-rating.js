'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'product_type', {
      type: Sequelize.STRING(20),
      allowNull: true,
      after: 'category',
    });

    await queryInterface.addColumn('products', 'discount_percent', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      after: 'price',
    });

    await queryInterface.addColumn('products', 'discount_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'discount_percent',
    });

    await queryInterface.addColumn('products', 'average_rating', {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
      after: 'image_url',
    });

    await queryInterface.addColumn('products', 'total_ratings', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'average_rating',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'total_ratings');
    await queryInterface.removeColumn('products', 'average_rating');
    await queryInterface.removeColumn('products', 'discount_expires_at');
    await queryInterface.removeColumn('products', 'discount_percent');
    await queryInterface.removeColumn('products', 'product_type');
  },
};
