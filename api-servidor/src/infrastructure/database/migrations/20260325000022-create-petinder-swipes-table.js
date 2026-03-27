'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petinder_swipes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      swiper_animal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'animals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      target_animal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'animals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_like: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('petinder_swipes', ['swiper_animal_id', 'target_animal_id'], {
      unique: true,
      name: 'petinder_swipes_pair_unique',
    });

    await queryInterface.addIndex('petinder_swipes', ['target_animal_id'], {
      name: 'petinder_swipes_target_idx',
    });

    await queryInterface.addIndex('petinder_swipes', ['is_like'], {
      name: 'petinder_swipes_is_like_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('petinder_swipes');
  },
};
