import { leagueController } from './../Controllers/leagueController';
import { Router } from 'express'

const leagueRoutes = Router();

leagueRoutes.get('/searchUser/:name/:tag', new leagueController().searchUser)

export { leagueRoutes };