'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company_professionals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('company_professionals', ['company_id', 'user_id'], {
      unique: true,
      name: 'company_professionals_unique',
    });

    await queryInterface.addIndex('company_professionals', ['user_id'], {
      name: 'company_professionals_user_id_idx',
    });

    await queryInterface.addIndex('company_professionals', ['company_id'], {
      name: 'company_professionals_company_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('company_professionals');
  },
};
