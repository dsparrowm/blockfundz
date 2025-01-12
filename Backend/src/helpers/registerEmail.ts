import nodemailer from 'nodemailer';

const RegisterEmail = async (email) => {

    // Configure the transporter
    const transporter = nodemailer.createTransport({
        host: 'mail.privateemail.com', // Namecheap SMTP host
        port: 465, // Use 587 for TLS/STARTTLS, or 465 for SSL
        secure: true, // Set to true for port 465, false for other ports
        auth: {
            user: 'support@nexgencrypto.live', // Your email address
            pass: 'Joycehope1530$', // Your email password
        },
        logger: true,
        debug: true,
    });

    // Email template
    const mailOptions = {
        from: '"NexGen Notifications" <notifications@nexgencrypto.live>', // Sender's email address.
        to: email, // Recipient's name and email address.
        subject: "Welcome onboard" ,// Subject line.
        text: "welcome" // Plaintext body.
      };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new Error(error.message);
        }

        return "Email sent successfully!";
    });
};

export default RegisterEmail;



