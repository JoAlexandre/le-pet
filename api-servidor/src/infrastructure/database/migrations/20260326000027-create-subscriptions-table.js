'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
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
      plan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'plans',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      stripe_customer_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      stripe_subscription_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      current_period_start: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      current_period_end: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      cancel_at_period_end: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('subscriptions', ['user_id'], {
      name: 'subscriptions_user_id_idx',
    });

    await queryInterface.addIndex('subscriptions', ['status'], {
      name: 'subscriptions_status_idx',
    });

    await queryInterface.addIndex('subscriptions', ['stripe_subscription_id'], {
      name: 'subscriptions_stripe_subscription_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('subscriptions');
  },
};
