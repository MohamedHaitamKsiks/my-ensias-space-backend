import { Request, Response } from "express";
import { Etudiant, EtudiantInterface } from "../model/etudiant.model";
import { RoleInterface } from "../model/role/role.model";


export const etudiantController = {

    async get(req: Request, res: Response) {
        const etudiantId = parseInt(req.params.etudiantId);
        const etudiant = await Etudiant.findByPk(etudiantId);

        if (!etudiant) {
            res.statusCode = 404;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.send(await etudiant.getEtudiantInterface());
    },

    async getAll(req: Request, res: Response) {
        const etudiants = await Etudiant.findAll();
        let etudiantsInterface: Array<EtudiantInterface> = [];

        for (let i = 0; i < etudiants.length; i++) {
            etudiantsInterface.push(await etudiants[i].getEtudiantInterface());
        }

        res.statusCode = 200;
        res.send(etudiantsInterface);
    },

    async add(req: Request, res: Response) {
        let newEtudiant = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            cin: req.body.cin,
            phone: req.body.phone,
            userId: req.body.userId
        };

        const etudiant = await Etudiant.create(newEtudiant);

        if (!etudiant || !(newEtudiant.nom && newEtudiant.prenom && newEtudiant.phone && newEtudiant.cin && newEtudiant.userId)) {
            res.statusCode = 400;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.send(await etudiant.getEtudiantInterface());
    },

    async edit(req: Request, res: Response) {
        const etudiantId = parseInt(req.params.etudiantId);
        const etudiant = await Etudiant.findByPk(etudiantId);

        if (!etudiant) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //edit etudiant
        if (req.body.nom)
            etudiant.nom = req.body.nom;
        if (req.body.prenom)
            etudiant.prenom = req.body.prenom;
        if (req.body.cin)
            etudiant.cin = req.body.cin;
        if (req.body.phone)
            etudiant.phone = req.body.phone;
        if (req.body.userId)
            etudiant.userId = req.body.userId;

        const newEtudiant = await etudiant.save();
        if (!newEtudiant) {
            res.statusCode = 400;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.send(await newEtudiant.getEtudiantInterface());
    },

    async delete(req: Request, res: Response) {
        const etudiantId = parseInt(req.params.etudiantId);
        const etudiant = await Etudiant.findByPk(etudiantId);

        if (!etudiant) {
            res.statusCode = 404;
            res.send();
            return;
        }

        await etudiant.destroy();
        res.statusCode = 200;
        res.send();
        
    },

    async getRoles(req: Request, res: Response) {
        const etudiantId = parseInt(req.params.etudiantId);
        const etudiant = await Etudiant.findByPk(etudiantId);

        if (!etudiant) {
            res.statusCode = 404;
            res.send();
            return;
        }

        let roles = await etudiant.getRoles();
        let rolesInterface :Array<RoleInterface> = [];

        for (let i = 0; i < roles.length; i++) {
            rolesInterface.push(await roles[i].getRoleInterface())
        }

        res.statusCode = 200;
        res.send(rolesInterface);
    },    

};