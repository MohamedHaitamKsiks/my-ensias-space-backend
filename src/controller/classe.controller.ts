import { Request, Response } from "express";
import { Classe, ClasseInterface } from "../model/classe.model";
import { Etudiant, EtudiantInterface } from "../model/etudiant.model";


export const classeController = { 

    async get(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.send(await classe.getClasseInterface());
    },

    async getAll(req: Request, res: Response) {
        const classes = await Classe.findAll();
        const classesInterface: Array<ClasseInterface> = [];

        for (let i = 0; i < classes.length; i++) {
            classesInterface.push(await classes[i].getClasseInterface());
        }

        res.statusCode = 200;
        res.send(classesInterface);
    },

    async add(req: Request, res: Response) {
        const newClasse = {
            id: req.body.id,
            nom: req.body.string
        }

        const classe = await Classe.create(newClasse);
        if (!classe) {
            res.statusCode = 400;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.send(await classe.getClasseInterface());
    },

    async edit(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        let classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const newClasse = {
            nom: req.body.string
        }

        if (newClasse.nom)
            classe.nom = newClasse.nom;

        classe = await classe.save();
        if (!classe) {
            res.statusCode = 400;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.send(await classe.getClasseInterface());

    },

    async delete(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        await classe.destroy();
        res.statusCode = 200;
        res.send();
    },

    async getEtudiants(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const etudiants = await classe.getEtudiants();
        const etudiantsInterface: Array<EtudiantInterface> = [];

        for (let i = 0; i < etudiants.length; i++) {
            etudiantsInterface.push(await etudiants[i].getEtudiantInterface());
        }

        res.statusCode = 200;
        res.send(etudiantsInterface);
    },

    async addEtudiant(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const etudiantId = parseInt(req.body.id);
        const etudiant = await Etudiant.findByPk(etudiantId);
    
        if (!etudiant) {
            res.statusCode = 400;
            res.send();
            return;
        }

        await classe.addEtudiant(etudiant);
        res.statusCode = 200;
        res.send(await etudiant.getEtudiantInterface());
    },

    async removeEtudiant(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const etudiantId = parseInt(req.body.id);
        const etudiant = await Etudiant.findByPk(etudiantId);

        if (!etudiant) {
            res.statusCode = 400;
            res.send();
            return;
        }

        await classe.removeEtudiant(etudiant);
        res.statusCode = 200;
        res.send();
    },

    async getDelegue(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const delegue = await classe.getEtudiantDelegue();
        res.statusCode = 200;
        res.send(await delegue.getEtudiantInterface());
    },

    async setDelegue(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const etudiantId = parseInt(req.body.id);
        const etudiant = await Etudiant.findByPk(etudiantId);

        if (!etudiant) {
            res.statusCode = 400;
            res.send();
            return;
        }

        const delegueRole = await (await classe.getDelegue()).getRole();

        const oldEtudiant = await delegueRole.getEtudiant();
        oldEtudiant.removeRole(delegueRole);

        etudiant.addRole(delegueRole);

        res.statusCode = 200;
        res.send(await etudiant.getEtudiantInterface());
    },

};