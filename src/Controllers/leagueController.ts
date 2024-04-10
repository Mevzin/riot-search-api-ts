import { Request, Response } from 'express'
import { searchByTagline } from './../service/apiRiot';
import { AppError } from '../Errors/AppError';

export class leagueController {
    async searchUser(req: Request, res: Response) {
        const { gameName, tagline } = req.params;
        try {
            const { data } = await searchByTagline.get(`/${gameName}/${tagline}`)
            res.status(200).json({ data })
        } catch (error) {
            throw new AppError("User not found", 404)
        }
    }
}