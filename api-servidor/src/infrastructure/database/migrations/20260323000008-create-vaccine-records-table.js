'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vaccine_records', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      animal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'animals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      professional_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      vaccine_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      vaccine_manufacturer: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      batch_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      application_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      next_dose_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('vaccine_records', ['animal_id'], {
      name: 'vaccine_records_animal_id_idx',
    });

    await queryInterface.addIndex('vaccine_records', ['professional_id'], {
      name: 'vaccine_records_professional_id_idx',
    });

    await queryInterface.addIndex('vaccine_records', ['application_date'], {
      name: 'vaccine_records_application_date_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vaccine_records');
  },
};
