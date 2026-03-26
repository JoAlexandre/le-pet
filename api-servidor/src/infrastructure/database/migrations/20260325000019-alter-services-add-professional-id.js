'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tornar company_id nullable via SQL direto (changeColumn pode falhar com FK existente)
    await queryInterface.sequelize.query(
      'ALTER TABLE `services` MODIFY `company_id` CHAR(36) NULL',
    );

    // Adicionar professional_id (servico pode pertencer a um profissional)
    const tableDesc = await queryInterface.describeTable('services');
    if (!tableDesc.professional_id) {
      await queryInterface.addColumn('services', 'professional_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      await queryInterface.addIndex('services', ['professional_id'], {
        name: 'services_professional_id_idx',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('services', 'services_professional_id_idx');
    await queryInterface.removeColumn('services', 'professional_id');

    await queryInterface.changeColumn('services', 'company_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
