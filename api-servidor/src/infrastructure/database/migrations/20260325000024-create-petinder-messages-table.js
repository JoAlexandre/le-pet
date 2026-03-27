'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petinder_messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      match_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'petinder_matches',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('petinder_messages', ['match_id'], {
      name: 'petinder_messages_match_id_idx',
    });

    await queryInterface.addIndex('petinder_messages', ['sender_id'], {
      name: 'petinder_messages_sender_id_idx',
    });

    await queryInterface.addIndex('petinder_messages', ['match_id', 'created_at'], {
      name: 'petinder_messages_match_created_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('petinder_messages');
  },
};
