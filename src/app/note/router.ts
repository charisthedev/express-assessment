import { Router, type Router as ExpressRouter } from 'express';
import { asyncHandler } from '../../common/middleware/async-handler.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import { AppDataSource } from '../../database/data-source';
import {
  createNoteSchema,
  noteIdParamSchema,
  noteListQuerySchema,
  updateNoteSchema
} from './dto/note.validation';
import { NoteController } from './note.controller';
import { NoteRepository } from './note.repository';
import { NoteService } from './note.service';

const router: ExpressRouter = Router();

const noteRepository = new NoteRepository(AppDataSource);
const noteService = new NoteService(noteRepository);
const noteController = new NoteController(noteService);

/**
 * @openapi
 * /notes:
 *   post:
 *     summary: Create a note
 *     tags:
 *       - Notes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteRequest'
 *     responses:
 *       201:
 *         description: Created note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 */
router.post('/notes', validate(createNoteSchema), asyncHandler(noteController.create));

/**
 * @openapi
 * /notes:
 *   get:
 *     summary: List notes with cursor pagination
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         required: false
 *         description: Cursor returned by previous page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         required: false
 *     responses:
 *       200:
 *         description: Paginated notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotesCursorResponse'
 *       400:
 *         description: Validation error
 */
router.get('/notes', validate(noteListQuerySchema, 'query'), asyncHandler(noteController.findAll));

/**
 * @openapi
 * /notes/{id}:
 *   get:
 *     summary: Get a note by id
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Note details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.get('/notes/:id', validate(noteIdParamSchema, 'params'), asyncHandler(noteController.findById));

/**
 * @openapi
 * /notes/{id}:
 *   patch:
 *     summary: Update a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteRequest'
 *     responses:
 *       200:
 *         description: Updated note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 */
router.patch(
  '/notes/:id',
  validate(noteIdParamSchema, 'params'),
  validate(updateNoteSchema),
  asyncHandler(noteController.update)
);

/**
 * @openapi
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
router.delete('/notes/:id', validate(noteIdParamSchema, 'params'), asyncHandler(noteController.delete));

export { router as noteRouter };
