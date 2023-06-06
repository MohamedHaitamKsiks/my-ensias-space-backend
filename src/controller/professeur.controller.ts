import { Request, Response } from "express";
import { Professeur, ProfesseurInterface } from "../model/matiere/professeur.model";
import { Matiere, MatiereInterface } from "../model/matiere/matiere.model";


export const professeurController = {

    async get(req: Request, res: Response) {
        //check professeur id
        const professeurId = parseInt(req.params.professeurId);
        let professeur = await Professeur.findByPk(professeurId);

        if (!professeur) {
            res.statusCode = 404;
            res.send();
            return;
        }
    },

    async getAll(req: Request, res: Response) {
        const professeurs = await Professeur.findAll();
        let professeursInterface: Array<ProfesseurInterface> = [];

        for (let i = 0; i < professeurs.length; i++) {
            professeursInterface.push(await professeurs[i].getProfesseurInterface());
        }

        res.statusCode = 200;
        res.send(professeursInterface);
    },

    async add(req: Request, res: Response) {
        //verify professeur 
        const newProfesseur = {
            nom: req.params.nom,
            prenom: req.params.prenom,
            email: req.params.email,
            phone: req.params.phone
        }
        if (!(newProfesseur.nom && newProfesseur.prenom && newProfesseur.email && newProfesseur.phone)) {
            res.statusCode = 400;
            res.send("invalid fields!");
            return;
        }

        //create 
        const professeur = await Professeur.create(newProfesseur);
        if (!professeur) {
            res.statusCode = 400;
            res.send("professeur wasn't created!");
            return;
        }

        res.statusCode = 200;
        res.send(await professeur.getProfesseurInterface());
    },

    async edit(req: Request, res: Response) {
        //check professeur id
        const professeurId = parseInt(req.params.professeurId);
        let professeur = await Professeur.findByPk(professeurId);

        if (!professeur) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const newProfesseur = {
            nom: req.params.nom,
            prenom: req.params.prenom,
            email: req.params.email,
            phone: req.params.phone
        }

        //edit professeur
        if (newProfesseur.nom)
            professeur.nom = newProfesseur.nom;

        if (newProfesseur.prenom)
            professeur.prenom = newProfesseur.prenom;

        if (newProfesseur.email)
            professeur.email = newProfesseur.email;

        if (newProfesseur.phone)
            professeur.phone = newProfesseur.phone;

        //save professeur
        professeur = await professeur.save();
        
        res.statusCode = 200;
        res.send(await professeur.getProfesseurInterface());
    },

    async delete(req: Request, res: Response) {
        //check professeur id
        const professeurId = parseInt(req.params.professeurId);
        let professeur = await Professeur.findByPk(professeurId);

        if (!professeur) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //destroy and send
        await professeur.destroy()
        res.statusCode = 200;
        res.send();
    },


    async matiereGet(req: Request, res: Response) {
        //check professeur id
        const professeurId = parseInt(req.params.professeurId);
        let professeur = await Professeur.findByPk(professeurId);

        if (!professeur) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const matieres = await professeur.getMatieres();
        let matieresInterface: Array<MatiereInterface> = [];

        for (let i = 0; i < matieres.length; i++) {
            matieresInterface.push(await matieres[i].getMatiereInterface());
        }

        res.statusCode = 200;
        res.send(matieresInterface);
    },

    async matiereAdd(req: Request, res: Response) {
        //check professeur id
        const professeurId = parseInt(req.params.professeurId);
        let professeur = await Professeur.findByPk(professeurId);

        if (!professeur) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //check matiere id
        const matiereId = parseInt(req.body.matereId);
        const matiere = await Matiere.findByPk(matiereId);
        if (!matiere) {
            res.statusCode = 400;
            res.send("matierer invalid!");
            return;
        }

        await professeur.addMatiere(matiere);
        res.statusCode = 200;
        res.send(await matiere.getMatiereInterface());
    },

    async matiereRemove(req: Request, res: Response) {
        //check professeur id
        const professeurId = parseInt(req.params.professeurId);
        let professeur = await Professeur.findByPk(professeurId);

        if (!professeur) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //check matiere id
        const matiereId = parseInt(req.body.matereId);
        const matiere = await Matiere.findByPk(matiereId);
        if (!matiere) {
            res.statusCode = 400;
            res.send("matierer invalid!");
            return;
        }

        await professeur.removeMatiere(matiere);
        res.statusCode = 200;
        res.send();
    },

};