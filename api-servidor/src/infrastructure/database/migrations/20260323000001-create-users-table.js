'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM('TUTOR', 'COMPANY', 'PROFESSIONAL'),
        allowNull: true,
      },
      auth_provider: {
        type: Sequelize.ENUM('GOOGLE', 'APPLE', 'MICROSOFT', 'EMAIL'),
        allowNull: false,
      },
      provider_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      specialty_type: {
        type: Sequelize.ENUM('VETERINARIAN', 'GROOMER', 'BATHER', 'TRAINER', 'OTHER'),
        allowNull: true,
      },
      crmv_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      crmv_state: {
        type: Sequelize.STRING(2),
        allowNull: true,
      },
      crmv_status: {
        type: Sequelize.ENUM('PENDING', 'VERIFIED', 'REJECTED'),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      is_onboarding_complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_unique',
    });

    await queryInterface.addIndex('users', ['auth_provider', 'provider_id'], {
      name: 'users_provider_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
