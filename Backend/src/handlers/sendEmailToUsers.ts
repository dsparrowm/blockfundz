import sendEmail from "../helpers/sendEmail";
import { Request, Response } from 'express';

const sendEmailToUsers = async (req: Request, res: Response) => {
    const { recipients, subject, body } = req.body;
    const mailOptions = {
        subject,
        from: 'support@nexgencrypto.live',
        to: recipients,
        html: `<!DOCTYPE html><html><head><title>Apex Digital</title></head><body>${body}</body></html>`,
    }
    try {
        await sendEmail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
    }
}

export default sendEmailToUsers;