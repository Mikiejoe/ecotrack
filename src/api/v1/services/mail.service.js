import nodemailer from 'nodemailer';
import config from '../../../config/index.js';
import logger from '../../../core/logger.js';
const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: {
        user: config.mail.user,
        pass: config.mail.pass,
    },
});
export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"App" <${config.mail.from}>`,
            to,
            subject,
            html,
        });
        logger.info('Email sent: %s', info.messageId);
        return info;
    }
    catch (error) {
        logger.error('Mail Error: %o', error);
        // throw error;
        return null
    }
};
