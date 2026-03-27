'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petinder_matches', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      animal_one_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'animals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      animal_two_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'animals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    });

    await queryInterface.addIndex('petinder_matches', ['animal_one_id', 'animal_two_id'], {
      unique: true,
      name: 'petinder_matches_pair_unique',
    });

    await queryInterface.addIndex('petinder_matches', ['animal_one_id'], {
      name: 'petinder_matches_animal_one_idx',
    });

    await queryInterface.addIndex('petinder_matches', ['animal_two_id'], {
      name: 'petinder_matches_animal_two_idx',
    });

    await queryInterface.addIndex('petinder_matches', ['is_active'], {
      name: 'petinder_matches_is_active_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('petinder_matches');
  },
};
