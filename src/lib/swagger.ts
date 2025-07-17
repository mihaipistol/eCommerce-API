export default {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'eCommerce CRUD REST API',
      version: '0.2.0',
      description:
        'This is a CRUD API made with Express and documented with Swagger',
    },
    servers: [
      {
        url: `http://localhost:3000`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'API for products in the e-commerce store',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'brand', 'category'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the product',
            },
            brand: {
              type: 'string',
              description: 'The brand of the product',
            },
            category: {
              type: 'string',
              description: 'The category of the product',
            },
            description: {
              type: 'string',
              description: 'The description of the product',
            },
            price: {
              type: 'number',
              format: 'double',
              description: 'The price of the product',
            },
            image: {
              type: 'string',
              description: 'The image of the product',
            },
            // createdAt: {type:''},
            // updatedAt: {type:''}
          },
        },
      },
      responses: {
        400: {
          description: 'Missing API KEY - include it in the Authorization header',
          content: {
            'application/json': {},
          },
        },
        401: {
          description: 'Unauthorized - incorrect API KEY or incorrect format',
          content: {
            'application/json': {},
          },
        },
        404: {
          description: 'Not found - The product was not found',
          content: {
            'application/json': {},
          },
        },
      },
    },
  },
  apis: [
    './src/route/authentication/router.ts',
    './src/route/orders/router.ts',
    './src/route/passwords/router.ts',
    './src/route/products/router.ts',
    './src/route/tags/router.ts',
    './src/route/users/router.ts',
  ],
};
