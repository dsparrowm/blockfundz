import nodemailer from 'nodemailer';
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from '../emails/emailTemplates';


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


const sendResetSuccessfulEmail = async (recipientEmail: string) => {

    const mailOptions = {
        from: '"NexGen Support" <support@nexgencrypto.live>', // Sender info
        to: recipientEmail, // Recipient
        subject: "Password Reset Successful", // Subject line
        html: PASSWORD_RESET_SUCCESS_TEMPLATE, // HTML content
    };

    try {
        await transporter.sendMail(mailOptions);
        return { message: "Password reset successful", isSuccess: true };
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
};

export default sendResetSuccessfulEmail;
