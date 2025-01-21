import nodemailer from 'nodemailer';
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from '../emails/emailTemplates';


const supportEmail = process.env.NAMECHEAP_SUPPORT_EMAIL;
const supportEmailPassword = process.env.NAMECHEAP_SUPPORT_PASSWORD;

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com', // Namecheap SMTP host
  port: 465, // Use 587 for TLS/STARTTLS, or 465 for SSL
  secure: true, // Set to true for port 465, false for other ports
  auth: {
    user: supportEmail, // Your email address
    pass: supportEmailPassword, // Your email password
  },
  logger: true,
  debug: true,
});


const sendWelcomeEmail = async (recipientEmail: string, userName: string) => {

  const mailOptions = {
    from: '"NexGen Team" <support@nexgencrypto.live>', // Sender info
    to: recipientEmail, // Recipient
    subject: "Welcome to NexGenCrypto!", // Subject line
    html: WELCOME_EMAIL_TEMPLATE.replace("{name}", userName), // HTML content
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

export default sendWelcomeEmail;
