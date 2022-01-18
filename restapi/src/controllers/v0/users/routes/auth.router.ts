// Node Imports
import { Router, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';
import * as EmailValidator from 'email-validator';
// Own imports
import config from "../../../../config";
import { User } from '../models/User';

// Constants
const SALT_ROUNDS = 10;
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

/**
 * Endpoint to validate jwt
 */
router.get('/verification', requireAuth,  async (req: Request, res: Response) => {
    return res.status(200).send({ auth: true, message: 'Authenticated.' });
});

/**
 * LOGIN WITH USER CREDENTIALS
 * Provided credentials in body {email: string, password: string}
 */
router.post('/login', async (req: Request, res: Response) => {
    // Check body
    const { email, password } = req.body;
    if (!email || !EmailValidator.validate(email)) return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    if (!password) return res.status(400).send({ auth: false, message: 'Password is required' });
    // If user not exists error
    const user = await User.findByPk(email);
    if(!user) return res.status(401).send({ auth: false, message: 'Unauthorized' });
    // Check password matches
    const result = await bcrypt.compare(password, user.password_hash);
    if (!result) return res.status(401).send({ auth: false, message: 'Unauthorized' });   
    // Generate JWT
    const jwtoken = jwt.sign(user.short(), JWT_CONFIG.SECRET);
    // Response
    res.status(200).send({ auth: true, token: jwtoken, user: user.short()});
});

/**
 * REGISTER NEW USER
 * With provided credentials in body {email: string, password: string}
 */
router.post('/', async (req: Request, res: Response) => {
    // Check body
    const { email, password } = req.body;
    if (!email || !EmailValidator.validate(email)) return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    if (!password) return res.status(400).send({ auth: false, message: 'Password is required' });
    // If user exists error
    const user = await User.findByPk(email);
    console.log(user);
    if(user) return res.status(422).send({ auth: false, message: 'User may already exist' });
    // Generate password hash and new user object
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await new User({
        email: email,
        password_hash: password_hash
    });
    // Save user and generates JWT
    const savedUser = await newUser.save();
    const jwtoken = jwt.sign(savedUser.short(), JWT_CONFIG.SECRET);
    // Response
    res.status(201).send({token: jwtoken, user: savedUser.short()});
});

/**
 * Help endpoint
 */
router.get('/', async (req: Request, res: Response) => {
    res.send('auth')
});

export const AuthRouter: Router = router;