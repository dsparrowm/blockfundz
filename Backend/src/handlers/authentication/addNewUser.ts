import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import hashPassword from "../../helpers/hashPassword";
import createJWT from "../../helpers/createJwt";
import { createUserSchema } from "../../utils/validationSchemas";

const addNewUser = async (req: Request, res: Response) => {
    // Start a transaction
    try {
        const { email, password, name, phone } = await createUserSchema.parseAsync(req.body);
        const result = await prisma.$transaction(async (tx) => {

            // Check if user exists within transaction
            const userExists = await tx.user.findUnique({
                where: { email }
            });

            if (userExists) {
                throw new Error('User already exists');
            }

            // Hash password
            const hashedPassword = await hashPassword(password);
            // Generate 6 digit verification code

            // Create user within transaction
            const createdUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    phone,
                    isVerified: false,
                    verificationToken: null,
                    verificationTokenExpiresAt: null // 1 hour
                }
            });

            // Prepare response payload
            const { password: _, ...userWithoutPassword } = createdUser;
            const payload = {
                id: createdUser.id,
                email: createdUser.email,
                name: createdUser.name,
                phone: createdUser.phone
            };

            const token = createJWT(res, payload);

            return {
                token,
                createdUser: userWithoutPassword
            };
        }, {
            // Transaction options
            maxWait: 5000, // 5s maximum wait time
            timeout: 10000  // 10s timeout
        });

        return res.status(200).json({
            message: "Account created successfully",
            ...result,
            isSuccess: true
        });

    } catch (err) {
        // Handle different types of errors
        if (err instanceof z.ZodError) {
            const formattedError = err.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message
            }));
            return res.status(400).json({
                errors: formattedError,
                isSuccess: false
            });
        }

        // Handle user exists error
        if (err.message === 'User already exists') {
            return res.status(409).json({
                message: "User already exists",
                isSuccess: false
            });
        }

        // Handle all other errors
        return res.status(500).json({
            message: "An error occurred while creating the account",
            error: err.message,
            isSuccess: false
        });
    }
};

export default addNewUser;