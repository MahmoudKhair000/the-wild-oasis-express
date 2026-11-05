import type { Request, Response } from 'express';
import swaggerSpec from '../config/swagger.ts';

export const serveSwaggerJson = (_req: Request, res: Response) => {
	res.json(swaggerSpec);
};

export const serveSwagger = (_req: Request, res: Response) => {
	res.type('html').send(`<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>The Wild Oasis API</title>
		<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.34.1/swagger-ui.css">
	</head>
	<body>
		<div id="swagger-ui"></div>
		<script src="https://unpkg.com/swagger-ui-dist@5.34.1/swagger-ui-bundle.js"></script>
		<script src="https://unpkg.com/swagger-ui-dist@5.34.1/swagger-ui-standalone-preset.js"></script>
		<script>
			window.onload = () => SwaggerUIBundle({
				url: window.location.origin + '/api-docs/openapi.json',
				dom_id: '#swagger-ui',
				deepLinking: true,
				presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
				layout: 'StandaloneLayout',
			});
		</script>
	</body>
</html>`);
};
