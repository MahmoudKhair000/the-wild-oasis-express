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
		<style>
			#auth-notice {
				font-size: 20px;
				margin-block: 10px;
				padding: 12px 16px;
				border: 1px solid #b8d5dc;
				border-radius: 4px;
				background: #eef6f8;
				color: #243746;
				text-align: center;
			}
		</style>
	</head>
	<body>
		<aside id="auth-notice" role="status" hidden>
			<strong>Authentication:</strong> Sign in here by executing '/users/login' or create account, <br/>and use your token to authorize requests. The token is valid for 1 hour.
		</aside>
		<div id="swagger-ui"></div>
		<script src="https://unpkg.com/swagger-ui-dist@5.34.1/swagger-ui-bundle.js"></script>
		<script src="https://unpkg.com/swagger-ui-dist@5.34.1/swagger-ui-standalone-preset.js"></script>
		<script>
		window.onload = () => {
			SwaggerUIBundle({
				url: window.location.origin + '/api-docs/openapi.json',
				dom_id: '#swagger-ui',
				deepLinking: true,
				presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
				layout: 'StandaloneLayout',
				onComplete: () => {
					document.getElementById('auth-notice').hidden = false;
				},
			});
		};
		</script>
	</body>
</html>`);
};
