'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      trade_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      legal_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      cnpj: {
        type: Sequelize.STRING(14),
        allowNull: true,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      logo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('companies', ['user_id'], {
      unique: true,
      name: 'companies_user_id_unique',
    });

    await queryInterface.addIndex('companies', ['cnpj'], {
      unique: true,
      name: 'companies_cnpj_unique',
    });

    await queryInterface.addIndex('companies', ['city', 'state'], {
      name: 'companies_location_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('companies');
  },
};
