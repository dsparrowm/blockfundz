import prisma from "../../db"
import { Request, Response } from 'express'

const getUserById = async (req: Request, res: Response) => {
    try {
        const { userDataId } = req.query
        console.log(userDataId)
        const userData = await prisma.user.findUnique({
            where: {
                id: parseInt(userDataId)
            },
        })
        if (!userData) {
            res.status(404)
            return res.json({ message: 'No userData found' })
        }
        // format userData data
        const user = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            isVerified: userData.isVerified,
            balances: [{ Bitcoin: userData.bitcoinBalance, Usdt: userData.usdtBalance, Usdc: userData.usdcBalance, Ethereum: userData.ethereumBalance }]

        }
        res.status(200)
        return res.json({ user })
    } catch (err) {
        console.log('Error fetching user data:', err)
    }
}

export default getUserById;