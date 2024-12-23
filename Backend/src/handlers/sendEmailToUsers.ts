import sendEmail from "../helpers/sendEmail";
import {Request, Response} from 'express';

const sendEmailToUsers = async (req: Request, res:Response) => {
    const {recipients, subject, body} = req.body;
    const mailOptions = {
        subject,
        htmlContent: `<!DOCTYPE html><html><head><title>Apex Digital</title></head><body>${body}</body></html>`,
        recipients,
    }
    try {
        await sendEmail(mailOptions);
        res.status(200).json({message: 'Email sent successfully'});
    } catch (error) {
        console.log(error);
    }
}

export default sendEmailToUsers;