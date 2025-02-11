import sendEmail from './sendEmail';
import { WELCOME_EMAIL_TEMPLATE } from '../emails/emailTemplates';

const sendWelcomeEmail = async (recipientEmail: string, userName: string) => {
  const mailOptions = {
    from: '"NexGen Team" <support@nexgencrypto.live>', // Sender info
    to: recipientEmail, // Recipient
    subject: "Welcome to NexGenCrypto!", // Subject line
    html: WELCOME_EMAIL_TEMPLATE.replace("{name}", userName), // HTML content
  };

  await sendEmail(mailOptions);
};

export default sendWelcomeEmail;