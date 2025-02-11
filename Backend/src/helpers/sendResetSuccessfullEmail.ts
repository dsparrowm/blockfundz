import sendEmail from './sendEmail';
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from '../emails/emailTemplates';

const sendResetSuccessfulEmail = async (recipientEmail: string) => {
    const mailOptions = {
        from: '"NexGen Support" <support@nexgencrypto.live>', // Sender info
        to: recipientEmail, // Recipient
        subject: "Password Reset Successful", // Subject line
        html: PASSWORD_RESET_SUCCESS_TEMPLATE, // HTML content
    };

    await sendEmail(mailOptions);
};

export default sendResetSuccessfulEmail;