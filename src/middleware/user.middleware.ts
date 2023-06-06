import { Request, Response, NextFunction } from "express";
import { User } from "../model/user.model";

export const userMiddleware = {
    // verify that user is logged 
    verifyUserLogged: async (req: Request, res: Response, next: NextFunction) => {
        if (!req.session.user) {
            res.send({
                notLogged: true
            });
        }       
        else {
            const user = await User.findByPk(req.session.user.id);
            if (user)
                req.session.user = user;
            next();
        }
    }
};
