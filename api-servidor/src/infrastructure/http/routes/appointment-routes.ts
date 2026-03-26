import { Router } from 'express';
import { appointmentController } from '../dependencies';
import { authMiddleware } from '../middlewares/auth-middleware';
import { roleMiddleware } from '../middlewares/role-middleware';

const appointmentRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     AppointmentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tutorId:
 *           type: string
 *           format: uuid
 *         animalId:
 *           type: string
 *           format: uuid
 *         professionalId:
 *           type: string
 *           format: uuid
 *         companyId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         serviceId:
 *           type: string
 *           format: uuid
 *         scheduledDate:
 *           type: string
 *           format: date
 *           description: Date in YYYY-MM-DD format
 *         startTime:
 *           type: string
 *           description: Start time in HH:mm format
 *         endTime:
 *           type: string
 *           description: End time in HH:mm format
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW]
 *         notes:
 *           type: string
 *           nullable: true
 *         cancellationReason:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedAppointments:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AppointmentResponse'
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
 * /appointments:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Book an appointment
 *     description: >
 *       Creates a new appointment. Only tutors can book appointments.
 *       The appointment must fall within the professional's or company's available schedule.
 *       If the professional is linked to a company, the company ID is automatically assigned.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - animalId
 *               - professionalId
 *               - serviceId
 *               - scheduledDate
 *               - startTime
 *               - endTime
 *             properties:
 *               animalId:
 *                 type: string
 *                 format: uuid
 *                 description: Animal ID (must belong to the tutor)
 *               professionalId:
 *                 type: string
 *                 format: uuid
 *                 description: Professional user ID
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *                 description: Service ID
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *                 description: Date in YYYY-MM-DD format
 *               startTime:
 *                 type: string
 *                 description: Start time in HH:mm format
 *               endTime:
 *                 type: string
 *                 description: End time in HH:mm format
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional)
 *           example:
 *             animalId: "550e8400-e29b-41d4-a716-446655440001"
 *             professionalId: "550e8400-e29b-41d4-a716-446655440002"
 *             serviceId: "550e8400-e29b-41d4-a716-446655440003"
 *             scheduledDate: "2026-04-01"
 *             startTime: "09:00"
 *             endTime: "10:00"
 *             notes: "Animal com alergia a shampoo comum"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       400:
 *         description: Invalid data or time slot not available
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - TUTOR role required
 *       404:
 *         description: Animal, professional, or service not found
 *       409:
 *         description: Time slot conflict
 */
appointmentRouter.post(
  '/appointments',
  authMiddleware,
  roleMiddleware('TUTOR'),
  (req, res, next) => appointmentController.create(req, res, next),
);

/**
 * @openapi
 * /appointments:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: List appointments
 *     description: >
 *       Lists appointments filtered by the authenticated user's role.
 *       Tutors see their own appointments.
 *       Professionals see appointments assigned to them.
 *       Companies see appointments at their establishment.
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
 *         description: Paginated list of appointments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAppointments'
 *       401:
 *         description: Unauthorized
 */
appointmentRouter.get(
  '/appointments',
  authMiddleware,
  (req, res, next) => appointmentController.list(req, res, next),
);

/**
 * @openapi
 * /appointments/{id}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get appointment details
 *     description: >
 *       Returns details of a specific appointment.
 *       Only the tutor, the assigned professional, or admin can view it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.get(
  '/appointments/:id',
  authMiddleware,
  (req, res, next) => appointmentController.getById(req, res, next),
);

/**
 * @openapi
 * /appointments/{id}/status:
 *   put:
 *     tags:
 *       - Appointments
 *     summary: Update appointment status
 *     description: >
 *       Updates the status of an appointment.
 *       Professionals can transition: PENDING -> CONFIRMED, CONFIRMED -> IN_PROGRESS/NO_SHOW,
 *       IN_PROGRESS -> COMPLETED.
 *       Tutors can only cancel (any cancellable status -> CANCELLED).
 *       Valid transitions: PENDING -> CONFIRMED/CANCELLED,
 *       CONFIRMED -> IN_PROGRESS/CANCELLED/NO_SHOW,
 *       IN_PROGRESS -> COMPLETED/CANCELLED.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW]
 *               cancellationReason:
 *                 type: string
 *                 description: Required when cancelling
 *           example:
 *             status: "CONFIRMED"
 *     responses:
 *       200:
 *         description: Appointment status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       400:
 *         description: Invalid status transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.put(
  '/appointments/:id/status',
  authMiddleware,
  (req, res, next) => appointmentController.updateStatus(req, res, next),
);

/**
 * @openapi
 * /appointments/{id}/cancel:
 *   put:
 *     tags:
 *       - Appointments
 *     summary: Cancel an appointment
 *     description: >
 *       Cancels an appointment. Both the tutor and the assigned professional can cancel.
 *       Only appointments with status PENDING, CONFIRMED, or IN_PROGRESS can be cancelled.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Appointment ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 description: Reason for cancellation (optional)
 *           example:
 *             cancellationReason: "Tutor indisponivel no horario"
 *     responses:
 *       200:
 *         description: Appointment cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentResponse'
 *       400:
 *         description: Cannot cancel with current status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.put(
  '/appointments/:id/cancel',
  authMiddleware,
  (req, res, next) => appointmentController.cancel(req, res, next),
);

export { appointmentRouter };
