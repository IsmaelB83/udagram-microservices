// Node Imports
import { Router, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';
// Own imports
import config from "../../../config";

// Constants
const JWT_CONFIG = config.JWT;

// Create router
const router: Router = Router();

/**
 * Authentication middleware to protect endpoints
 * @param req Request
 * @param res Response
 * @param next Next middleware
 * @returns Next
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    // Auth header not present error
    if (!req.headers || !req.headers.authorization) return res.status(401).send({ message: 'No authorization headers.' });
    // Token bearer   
    const token_bearer = req.headers.authorization.split(' ');
    if(token_bearer.length != 2) return res.status(401).send({ message: 'Malformed token.' });   
    const token = token_bearer[1];
    // Verify JWT
    try {
        return jwt.verify(token, JWT_CONFIG.SECRET, (err, decoded) => {
            if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate.' });
            return next();
          });             
    } catch (error) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate.' });
    }    
}

export const AuthRouter: Router = router;