import { z } from "zod";
import prisma from "../../db";
import comparePassword from "../../helpers/comparePassword";
import createJWT from "../../helpers/createJwt";
import { Request, Response } from 'express'
import { loginUserSchema } from "../../utils/validationSchemas";

const signin = async (req: Request, res: Response) => {
    try {
         const {email, password} = await loginUserSchema.parseAsync(req.body);
         const adminEmail = process.env.ADMIN_EMAIL
         const userQuery = await prisma.user.findUnique({
              where: {
                email
              },
              include: {
               transactions: true
               }
         })
         if (!userQuery || userQuery === null || userQuery.email === adminEmail) {
            res.status(404)
            res.json({message: 'invalid credentials', isSuccess: false})
            return
         }
         const isValid = await comparePassword(password, userQuery.password)
         if (!isValid) {
            res.status(401)
            res.json({message: 'Invalid Credentials', isSuccess: false})
            return
         }
         const payload = {
            id: userQuery.id,
            email: userQuery.email
         }
         const token = createJWT(payload)
         const user = {
            id: userQuery.id,
            email: userQuery.email, 
            name: userQuery.name, 
            phone: userQuery.phone,
            transactions: userQuery.transactions,
            balances: [{Bitcoin: userQuery.bitcoinBalance, Usdt: userQuery.usdtBalance, Usdc: userQuery.usdcBalance, Ethereum: userQuery.ethereumBalance}]

         }
         res.status(200)
         res.json({message: 'Login successful', token, isSuccess: true, user})
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

export default signin;