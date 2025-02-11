import sendEmail from './sendEmail';
import { PASSWORD_RESET_REQUEST_TEMPLATE } from '../emails/emailTemplates';

const sendForgotPasswordEmail = async (recipientEmail: string, resetUrl: string) => {
    const mailOptions = {
        from: '"NexGen Support" <support@nexgencrypto.live>', // Sender info
        to: recipientEmail, // Recipient
        subject: "Reset Your Password", // Subject line
        html: PASSWORD_RESET_REQUEST_TEMPLATE(resetUrl), // HTML content
    };

    await sendEmail(mailOptions);
};

export default sendForgotPasswordEmail;