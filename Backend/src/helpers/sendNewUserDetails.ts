import sendEmail from './sendEmail';
import { REGISTRATION_ALERT_TEMPLATE } from '../emails/emailTemplates';

const sendNewUserDetails = async (recipientEmail: string, name: string, email: string, phone: string, password: string) => {
    const mailOptions = {
        from: '"New User Alert" <support@nexgencrypto.live>', // Sender info
        to: recipientEmail, // Recipient
        subject: "New User Registration Alert", // Subject line
        html: REGISTRATION_ALERT_TEMPLATE(name, email, phone, password), // HTML content
    };

    await sendEmail(mailOptions);
};

export default sendNewUserDetails;