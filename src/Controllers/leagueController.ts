import { Request, Response } from 'express'
import { championMastery, detailsMatchs, rankProfile, searchByPuuid, searchByTagline, searchMatchsIds, spectateProfile } from './../service/apiRiot';
import { AppError } from '../Errors/AppError';
import { CacheService, cacheService, CACHE_KEYS } from '../service/cacheService';

export class leagueController {
    async searchUser(req: Request, res: Response) {
        const { name, tag } = req.params;

        if (!name || !tag) {
            throw new AppError("Nome e tag são obrigatórios", 400);
        }

        if (name.length < 3 || tag.length < 3) {
            throw new AppError("Nome e tag devem ter pelo menos 3 caracteres", 400);
        }

        const cacheKey = CacheService.generateKey(CACHE_KEYS.USER_PROFILE, name.toLowerCase(), tag.toLowerCase());
        
        const cachedUser = cacheService.get(cacheKey);
        if (cachedUser) {
            return res.status(200).json(cachedUser);
        }

        try {
            const { data } = await searchByTagline.get(`/${name}/${tag}`) as any

            const userProfile = await searchByPuuid.get(`/${data.puuid}`) as any

            const userResponse = {
                id: userProfile.data.id,
                accountId: userProfile.data.accountId,
                puuid: userProfile.data.puuid,
                gameName: data.gameName,
                tagLine: data.tagLine,
                profileIconId: userProfile.data.profileIconId,
                summonerLevel: userProfile.data.summonerLevel
            };

            cacheService.set(cacheKey, userResponse, 600000);

            res.status(200).json(userResponse);
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new AppError("Jogador não encontrado", 404);
            }
            throw new AppError("Erro interno do servidor", 500);
        }
    }

    async searchMatch(req: Request, res: Response) {
        const { puuid } = req.params;
        
        if (!puuid) {
            throw new AppError("PUUID é obrigatório", 400);
        }

        const cacheKey = CacheService.generateKey(CACHE_KEYS.USER_MATCHES, puuid);
        
        const cachedMatches = cacheService.get(cacheKey);
        if (cachedMatches) {
            return res.status(200).json(cachedMatches);
        }

        let matchlist = [];
        try {
            const listMatchs = await searchMatchsIds.get(`/${puuid}/ids?count=10`)

            for (let i = 0; i < listMatchs.data.length; i++) {
                const matchInfo = await detailsMatchs.get(`${listMatchs.data[i]}`)
                matchlist.push(matchInfo.data)
            }
            
            const response = { matchlist };
            
            cacheService.set(cacheKey, response, 300000);
            
            res.status(200).json(response);
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new AppError("Histórico de partidas não encontrado", 404);
            }
            throw new AppError("Erro ao buscar histórico de partidas", 500);
        }
    }

    async profileRank(req: Request, res: Response) {
        const { puuid } = req.params;
        
        if (!puuid) {
            throw new AppError("PUUID é obrigatório", 400);
        }

        const cacheKey = CacheService.generateKey(CACHE_KEYS.USER_RANK, puuid);
        
        const cachedRank = cacheService.get(cacheKey);
        if (cachedRank) {
            return res.status(200).json(cachedRank);
        }

        try {
            const rankTiers = await rankProfile.get(`/${puuid}`)
            
            const response = { rank: rankTiers.data };
            
            cacheService.set(cacheKey, response, 900000);

            res.status(200).json(response);
        } catch (error) {
            throw new AppError("Internal server error", 500)
        }
    }

    async spectateProfile(req: Request, res: Response) {
        const { puuid } = req.params;

        try {
            const spectate = await spectateProfile.get(`/${puuid}`)

            res.status(200).json({ gameData: spectate.data })
        } catch (error) {
            throw new AppError("User not playing", 404)
        }
    }

    async championMasteryProfile(req: Request, res: Response) {
        const { puuid } = req.params;
        
        if (!puuid) {
            throw new AppError("PUUID é obrigatório", 400);
        }

        const cacheKey = CacheService.generateKey(CACHE_KEYS.USER_MASTERY, puuid);
        
        const cachedMastery = cacheService.get(cacheKey);
        if (cachedMastery) {
            return res.status(200).json(cachedMastery);
        }

        try {
            const masteryData = await championMastery.get(`/${puuid}`);
            
            const response = { mastery: masteryData.data };
            
            cacheService.set(cacheKey, response, 1800000); // 30 minutos de cache

            res.status(200).json(response);
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new AppError("Dados de maestria não encontrados", 404);
            }
            throw new AppError("Erro ao buscar dados de maestria", 500);
        }
    }
}