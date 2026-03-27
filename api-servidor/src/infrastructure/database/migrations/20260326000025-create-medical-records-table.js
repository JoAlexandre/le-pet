'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medical_records', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      animal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'animals',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      professional_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM(
          'CONSULTATION',
          'CONSULTATION_RETURN',
          'CERTIFICATE_HEALTH',
          'CERTIFICATE_DEATH',
          'CERTIFICATE_VACCINE',
          'CERTIFICATE_TRANSPORT',
          'TERM_SURGERY',
          'TERM_ANESTHESIA',
          'TERM_EUTHANASIA',
          'TERM_HOSPITALIZATION',
          'PRESCRIPTION',
          'SURGICAL_REPORT',
          'EUTHANASIA_REPORT',
          'EXAM_RESULT',
          'OTHER',
        ),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      medications: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dosage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      treatment_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      anamnesis: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      physical_exam: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      vital_signs: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      valid_until: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      consent_given: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      attachment_url: {
        type: Sequelize.STRING(500),
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('medical_records', ['animal_id'], {
      name: 'idx_medical_records_animal_id',
    });
    await queryInterface.addIndex('medical_records', ['professional_id'], {
      name: 'idx_medical_records_professional_id',
    });
    await queryInterface.addIndex('medical_records', ['type'], {
      name: 'idx_medical_records_type',
    });
    await queryInterface.addIndex('medical_records', ['is_active'], {
      name: 'idx_medical_records_is_active',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('medical_records');
  },
};
