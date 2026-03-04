import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import { env } from '../../config/env';

const options: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Note Task API',
      version: '1.0.0',
      description: 'Note Task API'
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Local server'
      }
    ],
    components: {
      schemas: {
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok'
            },
            requestId: {
              type: 'string',
              format: 'uuid'
            }
          }
        },
        Note: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            title: {
              type: 'string',
              maxLength: 255
            },
            content: {
              type: 'string',
              nullable: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CreateNoteRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              maxLength: 255
            },
            content: {
              type: 'string',
              nullable: true
            }
          }
        },
        UpdateNoteRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              maxLength: 255
            },
            content: {
              type: 'string',
              nullable: true
            }
          }
        },
        CursorPageInfo: {
          type: 'object',
          properties: {
            hasNextPage: {
              type: 'boolean'
            },
            nextCursor: {
              type: 'string',
              nullable: true
            }
          }
        },
        NotesCursorResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Note'
              }
            },
            pageInfo: {
              $ref: '#/components/schemas/CursorPageInfo'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string'
            },
            requestId: {
              type: 'string',
              format: 'uuid'
            }
          }
        }
      }
    }
  },
  apis: ['src/app/**/*.ts', 'dist/app/**/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
