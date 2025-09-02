import { Request, Response } from 'express';
import prisma from '../../db';

const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Transaction id required' });

        const deleted = await prisma.transaction.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({ message: 'Transaction deleted', transaction: deleted });
    } catch (error: any) {
        console.error('Error deleting transaction:', error);
        return res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
    }
};

export default deleteTransaction;
