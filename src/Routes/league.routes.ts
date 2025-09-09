import { leagueController } from './../Controllers/leagueController';
import { Router } from 'express';
import { ValidationMiddleware, RateLimitMiddleware } from '../middleware/validation';

const leagueRoutes = Router();

const rateLimiter = RateLimitMiddleware.createRateLimit(60000, 100);

leagueRoutes.get('/searchUser/:name/:tag', 
    rateLimiter,
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validateUserSearch,
    new leagueController().searchUser
);

leagueRoutes.get('/searchMatchs/:puuid', 
    rateLimiter,
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validatePuuid,
    ValidationMiddleware.validateQueryParams,
    new leagueController().searchMatch
);

leagueRoutes.get('/getRankProfile/:puuid', 
    rateLimiter,
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validatePuuid,
    new leagueController().profileRank
);

leagueRoutes.get('/spectateGame/:puuid', 
    rateLimiter,
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validatePuuid,
    new leagueController().spectateProfile
);

leagueRoutes.get('/championMastery/:puuid', 
    rateLimiter,
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validatePuuid,
    new leagueController().championMasteryProfile
);

export { leagueRoutes };