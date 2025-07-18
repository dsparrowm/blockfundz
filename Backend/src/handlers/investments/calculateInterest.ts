import { Request, Response } from 'express';
import { InterestCalculationService } from '../../services/InterestCalculationService';

const calculateInterest = async (req: Request, res: Response) => {
    try {
        const result = await InterestCalculationService.manualInterestCalculation();

        res.status(200).json({
            message: 'Interest calculation completed successfully',
            data: result
        });
    } catch (error: any) {
        console.error('Error calculating interest:', error);
        res.status(500).json({
            message: 'Failed to calculate interest',
            error: error.message
        });
    }
};

export default calculateInterest;
