import nodemailer from 'nodemailer';

const createTransporter = () => {
    // Read from process.env dynamically instead of destructuring at import time
    const EMAIL_HOST = process.env.EMAIL_HOST;
    const EMAIL_PORT = process.env.EMAIL_PORT;
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_FROM = process.env.EMAIL_FROM;
    const EMAIL_TO = process.env.EMAIL_TO;
    
    console.log('[DEBUG] Email Config:', {
        EMAIL_HOST: EMAIL_HOST ? '✓' : '✗',
        EMAIL_PORT: EMAIL_PORT ? '✓' : '✗',
        EMAIL_USER: EMAIL_USER ? '✓' : '✗',
        EMAIL_PASS: EMAIL_PASS ? '✓' : '✗'
    });
    
    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
        console.warn('[emailUtils] SMTP configuration is incomplete. Emails will not be sent.');
        return null;
    }

    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT),
        secure: Number(EMAIL_PORT) === 465,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });
};

export const sendEmail = async ({ to, subject, html, text }) => {
    const EMAIL_FROM = process.env.EMAIL_FROM;
    const EMAIL_TO = process.env.EMAIL_TO;
    const EMAIL_USER = process.env.EMAIL_USER;
    
    const transporter = createTransporter();
    
    const mailOptions = {
        from: EMAIL_FROM || EMAIL_USER,
        to: to || EMAIL_TO,
        subject,
        text: text || (html ? html.replace(/<[^>]*>/g, '') : ''),
        html
    };

    if (!transporter) {
        console.log('📧 [EMAIL LOG] To:', mailOptions.to);
        console.log('📧 [EMAIL LOG] Subject:', mailOptions.subject);
        console.log('📧 [EMAIL LOG] Message details logged (SMTP not configured)');
        return { success: true, logged: true };
    }

    return transporter.sendMail(mailOptions);
};
