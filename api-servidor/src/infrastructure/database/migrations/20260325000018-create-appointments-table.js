'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      tutor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      animal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'animals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
      company_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      service_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      scheduled_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.STRING(5),
        allowNull: false,
        comment: 'HH:mm format',
      },
      end_time: {
        type: Sequelize.STRING(5),
        allowNull: false,
        comment: 'HH:mm format',
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'PENDING',
        comment: 'PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cancellation_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addIndex('appointments', ['tutor_id'], {
      name: 'appointments_tutor_id_idx',
    });

    await queryInterface.addIndex('appointments', ['professional_id'], {
      name: 'appointments_professional_id_idx',
    });

    await queryInterface.addIndex('appointments', ['company_id'], {
      name: 'appointments_company_id_idx',
    });

    await queryInterface.addIndex('appointments', ['scheduled_date'], {
      name: 'appointments_scheduled_date_idx',
    });

    await queryInterface.addIndex('appointments', ['status'], {
      name: 'appointments_status_idx',
    });

    await queryInterface.addIndex(
      'appointments',
      ['professional_id', 'scheduled_date', 'start_time', 'end_time'],
      {
        name: 'appointments_conflict_check_idx',
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('appointments');
  },
};
