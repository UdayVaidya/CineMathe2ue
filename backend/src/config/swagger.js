import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'CineMathèque API Documentation',
        version: '1.0.0',
        description: 'REST API documentation for the CineMathèque backend.',
        contact: {
            name: 'API Support',
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 5000}`,
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter the JWT token prefixed with "Bearer ". You can get this token by logging in.',
            },
        },
        responses: {
            UnauthorizedError: {
                description: 'Access token is missing or invalid',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                message: { type: 'string', example: 'Not authorized, token failed' },
                            },
                        },
                    },
                },
            },
            NotFoundError: {
                description: 'The requested resource was not found',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                message: { type: 'string', example: 'Resource not found' },
                            },
                        },
                    },
                },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
