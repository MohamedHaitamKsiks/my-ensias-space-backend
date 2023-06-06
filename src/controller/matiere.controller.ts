import { Request, Response } from "express";
import { Matiere, MatiereInterface } from "../model/matiere/matiere.model";


export const matiereController = {

    async get(req: Request, res: Response) {
        const matiereId = req.params.matiereId;
        let matiere = await Matiere.findByPk(matiereId);

        if (!matiere) {
            res.statusCode = 404;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.send(await matiere.getMatiereInterface());
    },

    async getAll(req: Request, res: Response) {
        const matieres = await Matiere.findAll();
        let matieresInterface: Array<MatiereInterface> = [];

        for (let i = 0; i < matieres.length; i++) {
            matieresInterface.push(await matieres[i].getMatiereInterface());
        }

        res.statusCode = 200;
        res.send(matieresInterface);
    },

    async add(req: Request, res: Response) {
        const newMatiere = {
            nom: req.body.nom
        }

        if (!newMatiere.nom) {
            res.statusCode = 400;
            res.send("bad fields!");
            return;
        }

        //create matiere
        const matiere = await Matiere.create({
            nom: newMatiere.nom
        });
        
        res.statusCode = 200;
        res.send(await matiere.getMatiereInterface());
    },

    async edit(req: Request, res: Response) {
        const matiereId = req.params.matiereId;
        let matiere = await Matiere.findByPk(matiereId);

        if (!matiere) {
            res.statusCode = 404;
            res.send();
            return;
        }
        const newMatiere = {
            nom: req.body.nom
        }

        if (newMatiere.nom)
            matiere.nom = newMatiere.nom;
        
        matiere = await matiere.save();

        res.statusCode = 200;
        res.send(await matiere.getMatiereInterface());
    },

    async delete(req: Request, res: Response) {
        const matiereId = req.params.matiereId;
        let matiere = await Matiere.findByPk(matiereId);

        if (!matiere) {
            res.statusCode = 404;
            res.send();
            return;
        }

        await matiere.destroy();
        res.statusCode = 200;
        res.send();
    },

};