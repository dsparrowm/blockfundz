import nodemailer from 'nodemailer';

const sendSupportEmail = async (req, res) => {
    const { recipients, subject, body } = req.body;

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
        from: '"NexGen Support" <support@nexgencrypto.live>', // Sender's email address.
        to: recipients, // Recipient's name and email address.
        subject, // Subject line.
        text: body // Plaintext body.
      };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.message);
        }

        res.status(200).send("Email sent successfully!");
    });
};

export default sendSupportEmail;



