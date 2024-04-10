import { leagueController } from './../Controllers/leagueController';
import { Router } from 'express'

const leagueRoutes = Router();

leagueRoutes.get('/searchUser/:gameName/:tagline', new leagueController().searchUser)

export { leagueRoutes };