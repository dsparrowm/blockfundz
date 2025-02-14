import { Request, Response } from 'express';
import prisma from '../../db';

const createTransaction = async (req: Request, res: Response) => {
    const {
        userId,
        type,
        asset,
        amount,
        status,
        date,
        name,
        phone,
        planName
    } = req.body;

    // Validate required fields
    if (!userId || !type || !asset || !amount || !status || !date || !name || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate planName for subscriptions
    if (type.toUpperCase() === 'SUBSCRIPTION' && !planName) {
        return res.status(400).json({ message: 'Plan name is required for subscriptions' });
    }

    try {
        // Create transaction details object
        const details: Record<string, any> = {
            name,
            phone,
            ...(planName && { planName }) // Conditionally add planName
        };

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                type: type.toUpperCase(),
                asset: asset.toUpperCase(),
                amount,
                status: status.toUpperCase(),
                date: new Date(date),
                name,
                phone,
                ...(type.toUpperCase() === 'SUBSCRIPTION' && { planName }) // Conditionally add details
            },
        });

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction
        });
    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default createTransaction;