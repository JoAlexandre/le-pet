'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('animals', {
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
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      species: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      breed: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      weight: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      microchip_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      photo_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      allergies: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      notes: {
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
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('animals', ['tutor_id'], {
      name: 'animals_tutor_id_idx',
    });

    await queryInterface.addIndex('animals', ['species'], {
      name: 'animals_species_idx',
    });

    await queryInterface.addIndex('animals', ['is_active'], {
      name: 'animals_is_active_idx',
    });

    await queryInterface.addIndex('animals', ['microchip_number'], {
      unique: true,
      name: 'animals_microchip_unique',
      where: {
        microchip_number: {
          [Sequelize.Op.ne]: null,
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('animals');
  },
};
