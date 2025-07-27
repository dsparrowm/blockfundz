import { Request, Response } from 'express';
import { conversationService } from '../services/conversationService';

export const conversationController = {
    getConversations: async (req: Request, res: Response) => {
        const conversations = await conversationService.getConversations(req.user.id);
        res.json(conversations);
    },

    getConversationByUser: async (req: Request, res: Response) => {
        const { userId } = req.params;
        const conversation = await conversationService.getConversationByUser(req.user.id, userId);
        if (!conversation) {
            return res.status(200).json(null);
        }
        res.json(conversation);
    },

    createConversation: async (req: Request, res: Response) => {
        const { userId } = req.body;
        const conversation = await conversationService.createConversation(req.user.id, userId);
        res.status(201).json(conversation);
    },
};