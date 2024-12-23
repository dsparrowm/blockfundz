import { z } from "zod";
import prisma from "../../db";
import comparePassword from "../../helpers/comparePassword";
import createJWT from "../../helpers/createJwt";
import { Request, Response } from 'express'
import { loginUserSchema } from "../../utils/validationSchemas";
import hashPassword from "../../helpers/hashPassword";
import dotenv from 'dotenv';

dotenv.config()

const adminLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = await loginUserSchema.parseAsync(req.body)
      const adminEmail = process.env.ADMIN_EMAIL
      const adminPassword = process.env.ADMIN_PASSWORD

      console.log(adminEmail, adminPassword)

      // check if environment variables are set
      if (!adminEmail || !adminPassword) {
         res.status(500)
         res.json({message: 'Admin credentials not set', isSuccess: false})
         return
      }

      // check if the email is correct
      if (email !== adminEmail) {
         res.status(401)
         res.json({message: 'Invalid Credentials', isSuccess: false})
         return
      }

      const hashedPassword = await hashPassword(adminPassword)

      // comapre password with hasehd password
      const isValid = await comparePassword(password, hashedPassword)

      if (!isValid) {
         res.status(401)
         res.json({message: 'Invalid Credentials', isSuccess: false})
         return
      }

      // check if the admin account exists in the database
      const userQuery = await prisma.user.findUnique({
         where: {
            email
         }
      })

      // if the admin doesn't exist, create an account in the database
      if (!userQuery) {
         const createdUser = await prisma.user.create({
            data: {
               email,
               password: hashedPassword,
               name: 'Admin',
            }
         })
         delete createdUser.password
         const token = createJWT(createdUser)
         res.status(200)
         res.json({message: 'Account Created successfully', token, createdUser, isSuccess: true})
         return
      } else {
         // if the admin exists, log the admin in
         const token = createJWT(userQuery)
         const userData = {
            id: userQuery.id,
            email: userQuery.email, 
            name: userQuery.name, 
         }
         res.status(200)
         res.json({message: 'Login successful', token, userData, isSuccess: true})
         return
      }
      
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
        res.json({message: "Something went wrong", isSuccess: false})
    }
    
}

export default adminLogin;