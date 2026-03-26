'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove price, discount, and stock from products (now on sizes)
    await queryInterface.removeColumn('products', 'price');
    await queryInterface.removeColumn('products', 'discount_percent');
    await queryInterface.removeColumn('products', 'discount_expires_at');
    await queryInterface.removeColumn('products', 'stock');

    // Add size_type, discount_percent, discount_expires_at to product_sizes
    await queryInterface.addColumn('product_sizes', 'size_type', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'WEIGHT',
      after: 'product_id',
    });

    await queryInterface.addColumn('product_sizes', 'discount_percent', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      after: 'price',
    });

    await queryInterface.addColumn('product_sizes', 'discount_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'discount_percent',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove new columns from product_sizes
    await queryInterface.removeColumn('product_sizes', 'discount_expires_at');
    await queryInterface.removeColumn('product_sizes', 'discount_percent');
    await queryInterface.removeColumn('product_sizes', 'size_type');

    // Re-add columns to products
    await queryInterface.addColumn('products', 'stock', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'discount_expires_at',
    });

    await queryInterface.addColumn('products', 'discount_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'discount_percent',
    });

    await queryInterface.addColumn('products', 'discount_percent', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      after: 'price',
    });

    await queryInterface.addColumn('products', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      after: 'product_type',
    });
  },
};
