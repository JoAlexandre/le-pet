'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schedules', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      owner_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      owner_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: 'COMPANY or PROFESSIONAL',
      },
      day_of_week: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '0=Sunday, 1=Monday, ..., 6=Saturday',
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

    await queryInterface.addIndex('schedules', ['owner_id', 'owner_type'], {
      name: 'schedules_owner_idx',
    });

    await queryInterface.addIndex('schedules', ['owner_id', 'owner_type', 'day_of_week'], {
      name: 'schedules_owner_day_idx',
    });

    await queryInterface.addIndex('schedules', ['is_active'], {
      name: 'schedules_is_active_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('schedules');
  },
};
