import prisma from "../../db"
import { Request, Response } from 'express'

const getUsers = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId
        const users = await prisma.user.findMany({
            include: {
                transactions: true
            }
        })
        if (!users) {
            res.status(404)
            return res.json({message: 'No user found'})
        }
        const formattedData = users.map(user => {
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
            }
        })
        res.status(200)
        return res.json({users})
    } catch (err) {
        throw new Error(err)
    }
}

export default getUsers;