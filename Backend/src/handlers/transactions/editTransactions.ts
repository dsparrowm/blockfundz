import { Request, Response } from 'express';
import prisma from '../../db';

const editTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Destructure all possible fields that can be edited
        const {
            amount,
            details,
            usdEquivalent,
            date,
            type,
            asset,
            status,
            planName,
            duration,
            name,
            phone,
            txHash
        } = req.body;

        // Build the update data object dynamically
        const data: any = {};
        if (amount !== undefined) data.amount = amount;
        if (details !== undefined) data.details = details;
        if (usdEquivalent !== undefined) data.usdEquivalent = usdEquivalent;
        if (date !== undefined) data.date = date;
        if (type !== undefined) data.type = type;
        if (asset !== undefined) data.asset = asset;
        if (status !== undefined) data.status = status;
        if (planName !== undefined) data.planName = planName;
        if (duration !== undefined) data.duration = duration;
        if (name !== undefined) data.name = name;
        if (phone !== undefined) data.phone = phone;
        if (txHash !== undefined) data.txHash = txHash;

        const updatedTransaction = await prisma.transaction.update({
            where: { id: Number(id) },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        res.status(200).json({ transaction: updatedTransaction });
    } catch (error) {
        console.error('Edit transaction error:', error); // Add this line for debugging
        res.status(400).json({ error: 'Failed to update transaction', details: error });
    }
}
export default editTransaction;