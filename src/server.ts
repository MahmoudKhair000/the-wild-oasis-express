import app from './app.ts';

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
	console.log(`Backend is listening on port ${port}`);
});
