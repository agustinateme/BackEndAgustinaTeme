import nodemailer from 'nodemailer';
import configs from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configs.userNodemailer,
        pass: configs.passwordNodemailer
    }
});

export const sendEmail = async (email) => {
    try {
        await transporter.sendMail({
            from: 'CoderHouse 55575',
            to: email.to,
            subject: email.subject,
            html: email.html
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}