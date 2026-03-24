'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Renomeia a tabela de express-session para nao conflitar
    await queryInterface.renameTable('sessions', 'web_sessions');

    // Cria a tabela de sessoes de autenticacao (modelo identico ao referencia)
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
      auth_provider: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      device_info: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.TEXT,
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
        defaultValue: Sequelize.NOW,
      },
      last_used_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('sessions', ['user_id'], {
      name: 'sessions_user_id_idx',
    });

    await queryInterface.addIndex('sessions', ['is_active'], {
      name: 'sessions_is_active_idx',
    });

    await queryInterface.addIndex('sessions', ['expires_at'], {
      name: 'sessions_expires_at_idx',
    });

    await queryInterface.addIndex('sessions', ['token'], {
      name: 'sessions_token_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sessions');
    await queryInterface.renameTable('web_sessions', 'sessions');
  },
};
