import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from '../utils.js';
import local from 'passport-local';
import userModel from '../dao/models/usersModel.js';
import jwt from 'passport-jwt';
import UserDTO from '../dto/userDTO.js';
import { CartsService } from '../services/cartsService.js';
import JWT from 'jsonwebtoken';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;
const PRIVATE_KEY = "CoderKeyFeliz";

const cartsService = new CartsService();

const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.c95423628cc74eb6',
        clientSecret: '2f4fe05fa392e11f0007d0d2383a96fa930713bb',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log({ profile })
            let user = await userService.findOne({ email: profile._json.email });
            if (user) return done(null, user);
            const newUser = {
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                age: 18,
                password: '',
            }
            user = await userService.create(newUser);
            return done(null, user);
        } catch (error) {
            return done({ message: 'Error creating user' });
        }
    }));

    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true,
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            let user = await userModel.findOne({ email: username });
            if (user) return done(null, false);
            let role = "user"
            if (email.includes("admin")) {
                role = "admin";
            }

            let cartId = await cartsService.createCart()
    
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: role,
                cart: cartId
            };
            user = await userModel.create(newUser);
            return done(null, user);
        } catch (error) {
            return done({ message: "Error creating user" });
        }
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username , password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) return done(null, false, { message: "User not found" });
            if (!isValidPassword(user, password)) return done(null, false);
            const { password: pass, ...userNoPass} = user._doc;
            return done(null, userNoPass);
        } catch (error) {
            return done({ message: "Error logging in" });
        }
    }));

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            const filter = new UserDTO(jwt_payload)
            return done(null, filter);
        } catch (error) {
            return done(error);
        }
    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await userModel.findOne({ _id });
            return done(null, user);
        } catch {
            return done({ message: "Error deserializing user" });
        }
    });
};

export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
};

export const decodedCookie = (cookie) => {
    const decoded = JWT.verify(cookie, PRIVATE_KEY);
    return decoded
}

export default initializePassport;