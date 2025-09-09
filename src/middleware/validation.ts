import { Request, Response, NextFunction } from 'express';
import { AppError } from '../Errors/AppError';

export class ValidationMiddleware {
    static validateUserSearch(req: Request, res: Response, next: NextFunction) {
        const { name, tag } = req.params;
        
        if (!name || !tag) {
            throw new AppError('Nome e tag são obrigatórios', 400);
        }
        
        const cleanName = name.trim();
        const cleanTag = tag.trim();
        
        if (cleanName.length < 3 || cleanName.length > 16) {
            throw new AppError('Nome deve ter entre 3 e 16 caracteres', 400);
        }
        
        if (cleanTag.length < 3 || cleanTag.length > 5) {
            throw new AppError('Tag deve ter entre 3 e 5 caracteres', 400);
        }
        
        const nameRegex = /^[\p{L}\p{N}\s]+$/u;
        const tagRegex = /^[a-zA-Z0-9]+$/;
        
        if (!nameRegex.test(cleanName)) {
            throw new AppError('Nome contém caracteres inválidos', 400);
        }
        
        if (!tagRegex.test(cleanTag)) {
            throw new AppError('Tag contém caracteres inválidos', 400);
        }
        
        req.params.name = cleanName;
        req.params.tag = cleanTag;
        
        next();
    }
    
    static validatePuuid(req: Request, res: Response, next: NextFunction) {
        const { puuid } = req.params;
        
        if (!puuid) {
            throw new AppError('PUUID é obrigatório', 400);
        }
        
        const cleanPuuid = puuid.trim();
        
        const puuidRegex = /^[a-zA-Z0-9_-]{78}$/;
        
        if (!puuidRegex.test(cleanPuuid)) {
            throw new AppError('PUUID inválido', 400);
        }
        
        req.params.puuid = cleanPuuid;
        next();
    }
    
    static validateQueryParams(req: Request, res: Response, next: NextFunction) {
        const { count, start } = req.query;
        
        if (count) {
            const countNum = parseInt(count as string);
            if (isNaN(countNum) || countNum < 1 || countNum > 100) {
                throw new AppError('Count deve ser um número entre 1 e 100', 400);
            }
            req.query.count = countNum.toString();
        }
        
        if (start) {
            const startNum = parseInt(start as string);
            if (isNaN(startNum) || startNum < 0) {
                throw new AppError('Start deve ser um número maior ou igual a 0', 400);
            }
            req.query.start = startNum.toString();
        }
        
        next();
    }
    
    static sanitizeInput(req: Request, res: Response, next: NextFunction) {
        const sanitize = (str: string): string => {
            return str.replace(/[<>"'&]/g, '');
        };
        
        for (const key in req.params) {
            if (typeof req.params[key] === 'string') {
                req.params[key] = sanitize(req.params[key]);
            }
        }
        
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = sanitize(req.query[key] as string);
            }
        }
        
        next();
    }
}

export class RateLimitMiddleware {
    private static requests: Map<string, { count: number; resetTime: number }> = new Map();
    
    static createRateLimit(windowMs: number = 60000, maxRequests: number = 100) {
        return (req: Request, res: Response, next: NextFunction) => {
            const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
            const now = Date.now();
            
            const clientData = this.requests.get(clientIp);
            
            if (!clientData || now > clientData.resetTime) {
                this.requests.set(clientIp, {
                    count: 1,
                    resetTime: now + windowMs
                });
                next();
            } else if (clientData.count < maxRequests) {
                clientData.count++;
                next();
            } else {
                throw new AppError('Muitas requisições. Tente novamente em alguns minutos.', 429);
            }
        };
    }
}