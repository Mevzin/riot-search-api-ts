import { Router } from 'express';
import { leagueRoutes } from './league.routes';

const router = Router();

router.use('/league', leagueRoutes);