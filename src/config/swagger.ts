import swaggerJsdoc from 'swagger-jsdoc';
import path from 'node:path';

const swaggerOptions: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'The Wild Oasis API',
			version: '1.0.0',
			description: 'API documentation for The Wild Oasis backend.',
		},
		servers: [{ url: '/', description: 'Current server' }],
		tags: [
			{ name: 'Users', description: 'Registration, authentication, and user administration' },
			{ name: 'Cabins', description: 'Cabin inventory and images' },
			{ name: 'Guests', description: 'Guest records' },
			{ name: 'Bookings', description: 'Guest reservations and booking management' },
			{ name: 'Settings', description: 'Application booking settings' },
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
			schemas: {
				ApiError: {
					type: 'object',
					properties: {
						ok: { type: 'boolean', example: false },
						message: { type: 'string' },
					},
				},
				CabinInput: {
					type: 'object',
					required: ['name', 'maxCapacity', 'regularPrice', 'discount', 'description'],
					properties: {
						name: { type: 'string', example: '001' },
						maxCapacity: { type: 'integer', example: 2 },
						regularPrice: { type: 'number', example: 250 },
						discount: { type: 'number', example: 0 },
						description: { type: 'string' },
						image: { type: 'string', format: 'binary', description: 'Cabin image upload' },
					},
				},
				CabinUpdateInput: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						maxCapacity: { type: 'integer' },
						regularPrice: { type: 'number' },
						discount: { type: 'number' },
						description: { type: 'string' },
						image: { type: 'string', format: 'binary', description: 'Cabin image upload' },
					},
				},
				GuestInput: {
					type: 'object',
					required: ['fullName', 'email'],
					properties: {
						fullName: { type: 'string', example: 'Taylor Morgan' },
						email: { type: 'string', format: 'email' },
						nationalID: { type: 'string', nullable: true },
						nationality: { type: 'string', nullable: true },
						countryFlag: { type: 'string', format: 'uri', nullable: true },
					},
				},
				GuestUpdateInput: {
					type: 'object',
					properties: {
						fullName: { type: 'string' },
						email: { type: 'string', format: 'email' },
						nationalID: { type: 'string', nullable: true },
						nationality: { type: 'string', nullable: true },
						countryFlag: { type: 'string', format: 'uri', nullable: true },
					},
				},
				BookingInput: {
					type: 'object',
					required: [
						'cabinId',
						'guestId',
						'startDate',
						'endDate',
						'numGuests',
						'numNights',
						'cabinPrice',
						'extrasPrice',
						'hasBreakfast',
						'observations',
					],
					properties: {
						cabinId: { type: 'string', description: 'MongoDB cabin ID' },
						guestId: { type: 'string', description: 'MongoDB guest ID' },
						startDate: { type: 'string', format: 'date' },
						endDate: { type: 'string', format: 'date' },
						numGuests: { type: 'integer' },
						numNights: { type: 'integer' },
						cabinPrice: { type: 'number' },
						extrasPrice: { type: 'number' },
						hasBreakfast: { type: 'boolean' },
						observations: { type: 'string' },
					},
				},
				BookingUpdateInput: {
					type: 'object',
					properties: {
						cabinId: { type: 'string', description: 'MongoDB cabin ID' },
						guestId: { type: 'string', description: 'MongoDB guest ID' },
						startDate: { type: 'string', format: 'date' },
						endDate: { type: 'string', format: 'date' },
						numGuests: { type: 'integer' },
						numNights: { type: 'integer' },
						cabinPrice: { type: 'number' },
						extrasPrice: { type: 'number' },
						hasBreakfast: { type: 'boolean' },
						observations: { type: 'string' },
					},
				},
				SettingsInput: {
					type: 'object',
					properties: {
						minimumNights: { type: 'integer', example: 2 },
						maximumNights: { type: 'integer', example: 30 },
						maximumGuests: { type: 'integer', example: 12 },
						breakfastPrice: { type: 'number', example: 15 },
					},
				},
				SignupInput: {
					type: 'object',
					required: ['firstName', 'lastName', 'email', 'password'],
					properties: {
						firstName: { type: 'string' },
						lastName: { type: 'string' },
						email: { type: 'string', format: 'email' },
						password: { type: 'string', format: 'password' },
					},
				},
				LoginInput: {
					type: 'object',
					required: ['email', 'password'],
					properties: {
						email: { type: 'string', format: 'email' },
						password: { type: 'string', format: 'password' },
					},
				},
			},
		},
	},
	apis: [path.join(process.cwd(), 'src', 'routes', '*.ts').replaceAll(path.sep, '/')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
