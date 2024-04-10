import { Router } from 'express';
import { leagueRoutes } from './league.routes';

const routes = Router();
routes.use('/league', leagueRoutes);

export { routes }