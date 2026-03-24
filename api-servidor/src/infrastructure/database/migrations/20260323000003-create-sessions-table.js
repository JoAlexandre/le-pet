'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      sid: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
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

    await queryInterface.addIndex('sessions', ['user_id'], {
      name: 'sessions_user_id_idx',
    });

    await queryInterface.addIndex('sessions', ['expires_at'], {
      name: 'sessions_expires_at_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sessions');
  },
};
