import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LePet API',
      version: '1.0.0',
      description: 'API for managing pet care services, professionals, and tutors',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/infrastructure/http/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
