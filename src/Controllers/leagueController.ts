import { Request, Response } from 'express'
import { detailsMatchs, searchByPuuid, searchByTagline, searchMatchsIds } from './../service/apiRiot';
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
                puuid: userProfile.data.puuid,
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
    async searchMatch(req: Request, res: Response) {
        const { puuid } = req.params;
        let matchlist = [];
        try {
            const listMatchs = await searchMatchsIds.get(`/${puuid}/ids?count=10`)

            for (let i = 0; i < listMatchs.data.length; i++) {
                const matchInfo = await detailsMatchs.get(`${listMatchs.data[i]}`)
                console.log(matchInfo)
                matchlist.push(matchInfo.data)
            }
            res.status(200).json({ matchlist })
        } catch (error) {
            console.error(error)
            throw new AppError("Internal server error", 500)
        }
    }
}