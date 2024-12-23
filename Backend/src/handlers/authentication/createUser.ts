import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import hashPassword from "../../helpers/hashPassword";
import createJWT from "../../helpers/createJwt";
import { createUserSchema } from "../../utils/validationSchemas";

const createNewUser = async (req: Request, res: Response) => {
    /**
     * Check if user already exists
     */
    try {
        const { email, password, name, phone } = await createUserSchema.parseAsync(req.body);
        const userExists = await prisma.user.findUnique({
            where: {
                email,
            }
        })
    
        if (userExists) {
            res.status(409)
            res.json({message: "User already Exists", isSuccess: false});
            return;
        }
    
        /**
         * if user doesn't exist, go ahead to create a new user
         */
        const hashedPassword = await hashPassword(password);
        const createdUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone
            }
        })
        delete createdUser.password
        const payload = {
            id: createdUser.id,
            email: createdUser.email,
            name: createdUser.name,
            phone: createdUser.phone
        }
        const token = createJWT(payload);
        res.status(200)
        res.json({message: "Account Created successfully", token, createdUser, isSuccess: true});
    } catch (err) {
        if (err instanceof z.ZodError) {
            const formattedError = err.errors.map(e => ({
               path: e.path.join('.'),
               message: e.message
            }))
         res.status(400)
         return res.json({errors: formattedError, isSuccess: false})
         }
        res.status(500)
        res.json({message: err.message, isSuccess: false})   
    }
}

export default createNewUser;