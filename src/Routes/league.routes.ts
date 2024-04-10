import { leagueController } from './../Controllers/leagueController';
import { Router } from 'express'

const leagueRoutes = Router();

leagueRoutes.get('/searchUser/:name/:tag', new leagueController().searchUser)
leagueRoutes.get('/searchMatchs/:puuid', new leagueController().searchMatch)
leagueRoutes.get('/getRankProfile/:puuid', new leagueController().profileRank)

export { leagueRoutes };