import swaggerJsdoc from 'swagger-jsdoc';
const apiPrefix = process.env.API_PREFIX || '/api/v1';
const corsOrigin = process.env.CORS_ORIGIN || ''; 
const serverPort = process.env.PORT || '3000'; 

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LePet API',
      version: '1.0.0',
      description: 'API for managing pet care services, professionals, and tutors',
    },
    servers: [
      process.env.NODE_ENV == 'production'
      ?
      {
        url: `${corsOrigin}${apiPrefix}`,
        description: 'Servidor de Desenvolvimento',
      }: 
      {
        url: `http://localhost:${serverPort}${apiPrefix}`,
        description: 'Servidor de Desenvolvimento',
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
