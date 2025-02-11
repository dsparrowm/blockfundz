import sendEmail from './sendEmail';
import { VERIFICATION_EMAIL_TEMPLATE } from '../emails/emailTemplates';

export const sendVerificationEmail = async (recipientEmail: string, verificationCode: string) => {
  const mailOptions = {
    from: '"NexGen Notifications" <support@nexgencrypto.live>', // Sender info
    to: recipientEmail, // Recipient
    subject: "Verify Your Email", // Subject line
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode), // HTML content
  };

  await sendEmail(mailOptions);
};

export default sendVerificationEmail;