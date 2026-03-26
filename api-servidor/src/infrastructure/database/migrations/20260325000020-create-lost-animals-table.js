'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lost_animals', {
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
        onDelete: 'CASCADE',
      },
      animal_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'animals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_seen_location: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      last_seen_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      contact_phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'LOST',
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('lost_animals', ['tutor_id'], {
      name: 'lost_animals_tutor_id_idx',
    });

    await queryInterface.addIndex('lost_animals', ['animal_id'], {
      name: 'lost_animals_animal_id_idx',
    });

    await queryInterface.addIndex('lost_animals', ['state', 'city'], {
      name: 'lost_animals_state_city_idx',
    });

    await queryInterface.addIndex('lost_animals', ['status'], {
      name: 'lost_animals_status_idx',
    });

    await queryInterface.addIndex('lost_animals', ['is_active'], {
      name: 'lost_animals_is_active_idx',
    });

    await queryInterface.addIndex('lost_animals', ['created_at'], {
      name: 'lost_animals_created_at_idx',
    });

    // Tabela de midia
    await queryInterface.createTable('lost_animal_media', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      lost_animal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'lost_animals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      media_type: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('lost_animal_media', ['lost_animal_id'], {
      name: 'lost_animal_media_lost_animal_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('lost_animal_media');
    await queryInterface.dropTable('lost_animals');
  },
};
