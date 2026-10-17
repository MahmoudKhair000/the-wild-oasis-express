import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS?.replace(/\s/g, '');

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port,
	secure: process.env.SMTP_SECURE
		? process.env.SMTP_SECURE === 'true'
		: port === 465,
	auth: user && pass ? { user, pass } : undefined,
});

export { transporter };
export default transporter;
