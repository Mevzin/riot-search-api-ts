import { Router } from 'express';
import { leagueRoutes } from './league.routes';

const routes = Router();
routes.use('/api/league', leagueRoutes);

export { routes }