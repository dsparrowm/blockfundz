import nodemailer from 'nodemailer';
import welcomeEmail from '../emails/welcome';
import { render } from '@react-email/render';
import WelcomeEmail from '../emails/welcome';
import React from 'react';
import { VERIFICATION_EMAIL_TEMPLATE } from '../emails/emailTemplates';


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


export const sendVerificationEmail = async (recipientEmail: string, verificationCode: string) => {

  const mailOptions = {
    from: '"NexGen Notifications" <support@nexgencrypto.live>', // Sender info
    to: recipientEmail, // Recipient
    subject: "Verify Your Email", // Subject line
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode), // HTML content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};



