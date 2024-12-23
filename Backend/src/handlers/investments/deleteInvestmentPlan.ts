import prisma from "../../db";
import { Request, Response } from "express";

const deleteInvestmentPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.investmentPlan.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200);
    res.json({ message: "Investment plan deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default deleteInvestmentPlan;