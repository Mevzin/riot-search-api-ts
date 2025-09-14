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
        const { start = '0', count = '10' } = req.query;
        
        if (!puuid) {
            throw new AppError("PUUID é obrigatório", 400);
        }

        const startNum = parseInt(start as string, 10);
        const countNum = Math.min(parseInt(count as string, 10), 20);

        if (isNaN(startNum) || isNaN(countNum) || startNum < 0 || countNum <= 0) {
            throw new AppError("Parâmetros start e count devem ser números válidos", 400);
        }

        const cacheKey = CacheService.generateKey(CACHE_KEYS.USER_MATCHES, puuid, startNum.toString(), countNum.toString());
        
        const cachedMatches = cacheService.get(cacheKey);
        if (cachedMatches) {
            return res.status(200).json(cachedMatches);
        }

        let matchlist = [];
        try {
            const listMatchs = await searchMatchsIds.get(`/${puuid}/ids?start=${startNum}&count=${countNum}`)

            for (let i = 0; i < listMatchs.data.length; i++) {
                const matchInfo = await detailsMatchs.get(`${listMatchs.data[i]}`)
                matchlist.push(matchInfo.data)
            }
            
            const response = { 
                matchlist,
                pagination: {
                    start: startNum,
                    count: countNum,
                    total: listMatchs.data.length,
                    hasMore: listMatchs.data.length === countNum
                }
            };
            
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
            
            cacheService.set(cacheKey, response, 1800000);

            res.status(200).json(response);
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new AppError("Dados de maestria não encontrados", 404);
            }
            throw new AppError("Erro ao buscar dados de maestria", 500);
        }
    }

    async recentTeammates(req: Request, res: Response) {
        const { puuid } = req.params;
        
        if (!puuid) {
            throw new AppError("PUUID é obrigatório", 400);
        }

        const cacheKey = CacheService.generateKey(CACHE_KEYS.USER_TEAMMATES, puuid);
        
        const cachedTeammates = cacheService.get(cacheKey);
        if (cachedTeammates) {
            return res.status(200).json(cachedTeammates);
        }

        try {
            // Buscar últimas 20 partidas do jogador
            const recentMatches = await searchMatchsIds.get(`/${puuid}/ids?start=0&count=20`);
            
            const teammatesMap = new Map();
            
            // Processar cada partida para encontrar companheiros de equipe
            for (const matchId of recentMatches.data) {
                try {
                    const matchDetails = await detailsMatchs.get(`${matchId}`);
                    const match = matchDetails.data;
                    
                    // Encontrar o jogador atual na partida
                    const currentPlayer = match.info.participants.find((p: any) => p.puuid === puuid);
                    if (!currentPlayer) continue;
                    
                    // Encontrar companheiros de equipe (mesmo teamId, mas não o próprio jogador)
                    const teammates = match.info.participants.filter((p: any) => 
                        p.teamId === currentPlayer.teamId && p.puuid !== puuid
                    );
                    
                    // Adicionar/atualizar estatísticas dos companheiros
                    teammates.forEach((teammate: any) => {
                        const key = teammate.puuid;
                        if (!teammatesMap.has(key)) {
                            teammatesMap.set(key, {
                                puuid: teammate.puuid,
                                riotIdGameName: teammate.riotIdGameName,
                                riotIdTagline: teammate.riotIdTagline,
                                profileIconId: teammate.profileIconId,
                                wins: 0,
                                losses: 0,
                                gamesPlayed: 0
                            });
                        }
                        
                        const teammateData = teammatesMap.get(key);
                        teammateData.gamesPlayed++;
                        
                        if (currentPlayer.win) {
                            teammateData.wins++;
                        } else {
                            teammateData.losses++;
                        }
                    });
                } catch (matchError) {
                    // Continuar mesmo se uma partida específica falhar
                    console.error(`Erro ao processar partida ${matchId}:`, matchError);
                    continue;
                }
            }
            
            // Converter para array e calcular porcentagem de vitórias
            const teammates = Array.from(teammatesMap.values())
                .map(teammate => ({
                    ...teammate,
                    winRate: teammate.gamesPlayed > 0 ? (teammate.wins / teammate.gamesPlayed) * 100 : 0
                }))
                .filter(teammate => teammate.gamesPlayed >= 2) // Filtrar apenas quem jogou pelo menos 2 partidas juntos
                .sort((a, b) => b.gamesPlayed - a.gamesPlayed) // Ordenar por número de jogos juntos
                .slice(0, 10); // Limitar a 10 companheiros
            
            const response = { teammates };
            
            // Cache por 30 minutos
            cacheService.set(cacheKey, response, 1800000);

            res.status(200).json(response);
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new AppError("Histórico de partidas não encontrado", 404);
            }
            throw new AppError("Erro ao buscar companheiros de equipe recentes", 500);
        }
    }
}