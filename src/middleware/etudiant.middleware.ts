import { Request, Response, NextFunction } from "express";
import { User } from "../model/user.model";
import { Etudiant } from "../model/etudiant.model";

export const etudiantMiddleware = {
    // verify that user is logged 
    verifyEtudiant: async (req: Request, res: Response, next: NextFunction) => {
        if (!req.session.etudiant ) {
            res.send({
                notEtudiant: true
            });
        }
        else {
            const etudiant = await Etudiant.findByPk(req.session.etudiant.id);
            if (etudiant)
                req.session.etudiant = etudiant;
            next();
        }
    }
};
