import { Request, Response } from 'express'
import { searchByPuuid, searchByTagline } from './../service/apiRiot';
import { AppError } from '../Errors/AppError';

export class leagueController {
    async searchUser(req: Request, res: Response) {
        const { name, tag } = req.params;

        try {
            const { data } = await searchByTagline.get(`/${name}/${tag}`) as any

            const userProfile = await searchByPuuid.get(`/${data.puuid}`) as any

            res.status(200).json({
                id: userProfile.data.id,
                accountId: userProfile.data.accountId,
                gameName: data.gameName,
                tagLine: data.tagLine,
                profileIconId: userProfile.data.profileIconId,
                summonerLevel: userProfile.data.summonerLevel
            })
        } catch (error) {
            console.error(error);

            throw new AppError("User not found", 404)
        }
    }
}