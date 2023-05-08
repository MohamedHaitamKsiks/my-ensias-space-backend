import { Request, Response, NextFunction } from "express";
import { User } from "../model/user.model";

export const userMiddleware = {
    // verify that user is logged 
    verifyEtudiant: async (req: Request, res: Response, next: NextFunction) => {
        if (!req.session.etudiantId ) {
            res.send({
                notEtudiant: true
            });
        }
        else {
            next();
        }
    }
};
