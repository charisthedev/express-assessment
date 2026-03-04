import Joi from 'joi';

export const createNoteSchema = Joi.object({
  title: Joi.string().trim().max(255).required(),
  content: Joi.string().allow('', null).optional()
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().trim().max(255).optional(),
  content: Joi.string().allow('', null).optional()
}).min(1);

export const noteIdParamSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4', 'uuidv5'] })
    .required()
});

export const noteListQuerySchema = Joi.object({
  cursor: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});
