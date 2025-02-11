import nodemailer from 'nodemailer';

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

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async (options: EmailOptions) => {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
