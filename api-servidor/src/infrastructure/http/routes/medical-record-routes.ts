import { Router } from 'express';
import { medicalRecordController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';
import { crmvMiddleware } from '../middlewares/crmv-middleware';
import { validationMiddleware } from '../middlewares/validation-middleware';

const medicalRecordRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     MedicalRecordResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         animalId:
 *           type: string
 *           format: uuid
 *         professionalId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum:
 *             - CONSULTATION
 *             - CONSULTATION_RETURN
 *             - CERTIFICATE_HEALTH
 *             - CERTIFICATE_DEATH
 *             - CERTIFICATE_VACCINE
 *             - CERTIFICATE_TRANSPORT
 *             - TERM_SURGERY
 *             - TERM_ANESTHESIA
 *             - TERM_EUTHANASIA
 *             - TERM_HOSPITALIZATION
 *             - PRESCRIPTION
 *             - SURGICAL_REPORT
 *             - EUTHANASIA_REPORT
 *             - EXAM_RESULT
 *             - OTHER
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         diagnosis:
 *           type: string
 *           nullable: true
 *         medications:
 *           type: string
 *           nullable: true
 *         dosage:
 *           type: string
 *           nullable: true
 *         treatmentNotes:
 *           type: string
 *           nullable: true
 *         reason:
 *           type: string
 *           nullable: true
 *         anamnesis:
 *           type: string
 *           nullable: true
 *           description: Patient history (used in consultations)
 *         physicalExam:
 *           type: string
 *           nullable: true
 *           description: Physical exam findings (used in consultations)
 *         vitalSigns:
 *           type: string
 *           nullable: true
 *           description: Vital signs (weight, temperature, HR, RR)
 *         validUntil:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Expiration date (used in certificates)
 *         consentGiven:
 *           type: boolean
 *           nullable: true
 *           description: Whether consent was given (used in terms)
 *         attachmentUrl:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedMedicalRecords:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MedicalRecordResponse'
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 */

/**
 * @openapi
 * /animals/{animalId}/medical-records:
 *   post:
 *     tags:
 *       - Medical Records
 *     summary: Create a medical record for an animal
 *     description: >
 *       Creates a new medical record (prescription, report, etc.) for the specified animal.
 *       Only VETERINARIAN professionals with CRMV status VERIFIED can create medical records.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Animal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *             properties:
 *               type:
 *                 type: string
 *                 enum:
 *                   - CONSULTATION
 *                   - CONSULTATION_RETURN
 *                   - CERTIFICATE_HEALTH
 *                   - CERTIFICATE_DEATH
 *                   - CERTIFICATE_VACCINE
 *                   - CERTIFICATE_TRANSPORT
 *                   - TERM_SURGERY
 *                   - TERM_ANESTHESIA
 *                   - TERM_EUTHANASIA
 *                   - TERM_HOSPITALIZATION
 *                   - PRESCRIPTION
 *                   - SURGICAL_REPORT
 *                   - EUTHANASIA_REPORT
 *                   - EXAM_RESULT
 *                   - OTHER
 *                 description: Type of medical record
 *               title:
 *                 type: string
 *                 description: Title of the record
 *               description:
 *                 type: string
 *                 description: General description
 *               diagnosis:
 *                 type: string
 *                 description: Clinical diagnosis
 *               medications:
 *                 type: string
 *                 description: Medications used or prescribed
 *               dosage:
 *                 type: string
 *                 description: Dosage instructions
 *               treatmentNotes:
 *                 type: string
 *                 description: Treatment notes and observations
 *               reason:
 *                 type: string
 *                 description: Reason for treatment (e.g. euthanasia motive)
 *               anamnesis:
 *                 type: string
 *                 description: Patient history reported by tutor (consultations)
 *               physicalExam:
 *                 type: string
 *                 description: Physical exam findings (consultations)
 *               vitalSigns:
 *                 type: string
 *                 description: "Vital signs (e.g. Peso: 12kg, Temp: 38.5C, FC: 80bpm, FR: 20rpm)"
 *               validUntil:
 *                 type: string
 *                 format: date
 *                 description: Certificate expiration date (YYYY-MM-DD, for certificates)
 *               consentGiven:
 *                 type: boolean
 *                 description: Whether the tutor gave consent (for terms)
 *           examples:
 *             consultation:
 *               summary: Consultation
 *               value:
 *                 type: CONSULTATION
 *                 title: "Consulta de rotina - Mia"
 *                 anamnesis: "Tutor relata que animal esta comendo bem, sem alteracoes comportamentais"
 *                 physicalExam: "Mucosas rosas, linfonodos sem alteracoes, abdomen sem dor a palpacao"
 *                 vitalSigns: "Peso: 12kg, Temp: 38.5C, FC: 80bpm, FR: 20rpm"
 *                 diagnosis: "Animal saudavel, peso adequado"
 *                 treatmentNotes: "Vacinas em dia. Proximo retorno em 12 meses."
 *             certificate_health:
 *               summary: Health certificate
 *               value:
 *                 type: CERTIFICATE_HEALTH
 *                 title: "Atestado de Saude - Rex"
 *                 description: "Atesto que o animal se encontra clinicamente saudavel"
 *                 physicalExam: "Exame fisico sem alteracoes, vacinacao em dia"
 *                 vitalSigns: "Peso: 25kg, Temp: 38.2C, FC: 90bpm"
 *                 validUntil: "2026-04-26"
 *             term_euthanasia:
 *               summary: Euthanasia consent term
 *               value:
 *                 type: TERM_EUTHANASIA
 *                 title: "Termo de Consentimento - Eutanasia Rex"
 *                 description: "Termo de consentimento para procedimento de eutanasia"
 *                 reason: "Sofrimento intenso, prognostico terminal, qualidade de vida comprometida"
 *                 diagnosis: "Neoplasia hepatica avancada sem resposta ao tratamento"
 *                 consentGiven: true
 *                 treatmentNotes: "Tutor ciente dos riscos e procedimento. Assinatura coletada."
 *             euthanasia_report:
 *               summary: Euthanasia report
 *               value:
 *                 type: EUTHANASIA_REPORT
 *                 title: "Relatorio de Eutanasia - Rex"
 *                 description: "Procedimento de eutanasia realizado devido a estado terminal"
 *                 diagnosis: "Neoplasia hepatica avancada sem resposta ao tratamento"
 *                 medications: "Tiopental sodico 25mg/kg IV + Cloreto de potassio 2mEq/kg IV"
 *                 dosage: "Tiopental 500mg IV seguido de KCl 40mEq IV"
 *                 reason: "Sofrimento intenso, prognostico terminal"
 *                 treatmentNotes: "Tutor presente e ciente. Procedimento indolor."
 *             prescription:
 *               summary: Prescription
 *               value:
 *                 type: PRESCRIPTION
 *                 title: "Receita - Tratamento dermatologico"
 *                 diagnosis: "Dermatite alergica"
 *                 medications: "Prednisolona 20mg, Cefalexina 500mg"
 *                 dosage: "Prednisolona 1mg/kg 1x/dia por 7 dias, Cefalexina 30mg/kg 2x/dia por 14 dias"
 *                 treatmentNotes: "Retorno em 15 dias para reavaliacao"
 *             term_surgery:
 *               summary: Surgery consent term
 *               value:
 *                 type: TERM_SURGERY
 *                 title: "Termo de Consentimento Cirurgico - Castracao"
 *                 description: "Consentimento para procedimento de ovariosalpingohisterectomia"
 *                 reason: "Castracao eletiva"
 *                 consentGiven: true
 *                 treatmentNotes: "Tutor orientado sobre jejum de 12h e cuidados pos-operatorios"
 *     responses:
 *       201:
 *         description: Medical record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalRecordResponse'
 *       400:
 *         description: Invalid input (missing or invalid fields)
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - CRMV not verified or insufficient permissions
 *       404:
 *         description: Animal not found
 */
medicalRecordRouter.post(
  '/animals/:animalId/medical-records',
  authMiddleware,
  roleMiddleware('PROFESSIONAL'),
  crmvMiddleware,
  validationMiddleware({
    type: { required: true, type: 'string' },
    title: { required: true, type: 'string' },
  }),
  (req, res, next) => medicalRecordController.create(req, res, next),
);

/**
 * @openapi
 * /animals/{animalId}/medical-records:
 *   get:
 *     tags:
 *       - Medical Records
 *     summary: List medical records for an animal
 *     description: >
 *       Returns all medical records for a specific animal with pagination.
 *       Can be filtered by record type.
 *       Accessible by PROFESSIONAL and TUTOR (tutor sees records of own animals).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animalId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Animal ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - CONSULTATION
 *             - CONSULTATION_RETURN
 *             - CERTIFICATE_HEALTH
 *             - CERTIFICATE_DEATH
 *             - CERTIFICATE_VACCINE
 *             - CERTIFICATE_TRANSPORT
 *             - TERM_SURGERY
 *             - TERM_ANESTHESIA
 *             - TERM_EUTHANASIA
 *             - TERM_HOSPITALIZATION
 *             - PRESCRIPTION
 *             - SURGICAL_REPORT
 *             - EUTHANASIA_REPORT
 *             - EXAM_RESULT
 *             - OTHER
 *         description: Filter by record type
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of medical records
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMedicalRecords'
 *       401:
 *         description: Missing or invalid authorization
 *       404:
 *         description: Animal not found
 */
medicalRecordRouter.get(
  '/animals/:animalId/medical-records',
  authMiddleware,
  roleMiddleware('PROFESSIONAL', 'TUTOR', 'ADMIN'),
  (req, res, next) => medicalRecordController.listByAnimal(req, res, next),
);

/**
 * @openapi
 * /medical-records/professional:
 *   get:
 *     tags:
 *       - Medical Records
 *     summary: List medical records created by the authenticated professional
 *     description: >
 *       Returns all medical records created by the currently authenticated veterinarian.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of medical records
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMedicalRecords'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - not a professional
 */
medicalRecordRouter.get(
  '/medical-records/professional',
  authMiddleware,
  roleMiddleware('PROFESSIONAL'),
  (req, res, next) => medicalRecordController.listByProfessional(req, res, next),
);

/**
 * @openapi
 * /medical-records/{id}:
 *   get:
 *     tags:
 *       - Medical Records
 *     summary: Get a specific medical record
 *     description: Returns the details of a specific medical record by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Medical Record ID
 *     responses:
 *       200:
 *         description: Medical record details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalRecordResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       404:
 *         description: Medical record not found
 */
medicalRecordRouter.get(
  '/medical-records/:id',
  authMiddleware,
  roleMiddleware('PROFESSIONAL', 'TUTOR', 'ADMIN'),
  (req, res, next) => medicalRecordController.getById(req, res, next),
);

/**
 * @openapi
 * /medical-records/{id}:
 *   put:
 *     tags:
 *       - Medical Records
 *     summary: Update a medical record
 *     description: >
 *       Updates an existing medical record. Only the author (veterinarian who created it) can update.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Medical Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *               medications:
 *                 type: string
 *               dosage:
 *                 type: string
 *               treatmentNotes:
 *                 type: string
 *               reason:
 *                 type: string
 *               anamnesis:
 *                 type: string
 *               physicalExam:
 *                 type: string
 *               vitalSigns:
 *                 type: string
 *               validUntil:
 *                 type: string
 *                 format: date
 *               consentGiven:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Medical record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalRecordResponse'
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - only the author can update
 *       404:
 *         description: Medical record not found
 */
medicalRecordRouter.put(
  '/medical-records/:id',
  authMiddleware,
  roleMiddleware('PROFESSIONAL'),
  crmvMiddleware,
  (req, res, next) => medicalRecordController.update(req, res, next),
);

/**
 * @openapi
 * /medical-records/{id}:
 *   delete:
 *     tags:
 *       - Medical Records
 *     summary: Delete a medical record (soft delete)
 *     description: >
 *       Soft deletes a medical record. Only the author or an ADMIN can delete.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Medical Record ID
 *     responses:
 *       204:
 *         description: Medical record deleted successfully
 *       401:
 *         description: Missing or invalid authorization
 *       403:
 *         description: Access denied - only the author or admin can delete
 *       404:
 *         description: Medical record not found
 */
medicalRecordRouter.delete(
  '/medical-records/:id',
  authMiddleware,
  roleMiddleware('PROFESSIONAL', 'ADMIN'),
  (req, res, next) => medicalRecordController.delete(req, res, next),
);

export { medicalRecordRouter };
