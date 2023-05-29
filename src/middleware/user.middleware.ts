import { Request, Response, NextFunction } from "express";

export const userMiddleware = {
    // verify that user is logged 
    verifyUserLogged: (req: Request, res: Response, next: NextFunction) => {
        if (!req.session.userId) {
            res.send({
                notLogged: true
            });
        }       
        else
            next();
    }
};
