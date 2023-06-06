import { Request, Response } from "express";
import { Club, ClubInterface } from "../model/club.model";
import { Etudiant, EtudiantInterface } from "../model/etudiant.model";


export const clubController = {
    

    async get(req: Request, res: Response) {
        const clubId = parseInt(req.params.clubId);
        const club = await Club.findByPk(clubId);

        if (!club) {
            res.statusCode = 404;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.send(await club.getClubInterface());
    },

    async getAll(req: Request, res: Response) {
        const clubs = await Club.findAll();
        let clubsInterface: Array<ClubInterface> = []

        for (let i = 0; i < clubs.length; i++) {
            clubsInterface.push(await clubs[i].getClubInterface())
        }

        res.statusCode = 200;
        res.send(clubsInterface);
    },

    async add(req: Request, res: Response) {
        //request format
        const newClub = {
            nom: req.body.nom,
            description: req.body.description
        }

        //invalide req.body
        if (!newClub.nom || !newClub.description) {
            res.statusCode = 400;
            res.send("arguments missing");
            return;
        }

        const club = await Club.create({
            nom: newClub.nom,
            description: newClub.description
        });

        if (!club) {
            res.statusCode = 400;
            res.send("error");
            return;
        }

        res.statusCode = 200;
        res.send(await club.getClubInterface());

    },

    async edit(req: Request, res: Response) {
        const clubId = parseInt(req.params.clubId);
        let club = await Club.findByPk(clubId);

        if (!club) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //edit nom
        const newNom = req.body.nom;
        if (newNom)
            club.nom = newNom;

        //edit description
        const newDescription = req.body.description;
        if (newDescription)
            club.description = newDescription;

        club = await club.save();

        res.statusCode = 200;
        res.send(await club.getClubInterface());
    },

    async delete(req: Request, res: Response) {
        const clubId = parseInt(req.params.clubId);
        const club = await Club.findByPk(clubId);

        if (!club) {
            res.statusCode = 404;
            res.send();
            return;
        }

        await club.destroy();

        res.statusCode = 200;
        res.send();
    },

    //members
    async memberGet(req: Request, res: Response) {
        const clubId = parseInt(req.params.clubId);
        const club = await Club.findByPk(clubId);

        if (!club) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const members = await club.getMembers();
        let membersInterface: Array<EtudiantInterface> = [];
        for (let i = 0; i < members.length; i++) {
            membersInterface.push(await members[i].getEtudiantInterface())
        }

        res.statusCode = 200;
        res.send(membersInterface);
    },

    async memberAdd(req: Request, res: Response) {
        const clubId = parseInt(req.params.clubId);
        const club = await Club.findByPk(clubId);

        if (!club) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //check etudiant id
        const etudiantId = parseInt(req.body.etudiantId);
        const etudiant = await Etudiant.findByPk(etudiantId);

        if (!etudiantId || !etudiant) {
            res.statusCode = 400;
            res.send("etudiantId invalid");
            return;
        }

        //add etudiant
        await club.addMember(etudiant);

        //response
        res.statusCode = 200;
        res.send(await etudiant.getEtudiantInterface());
    },

    async memberRemove(req: Request, res: Response) {
        const clubId = parseInt(req.params.clubId);
        const club = await Club.findByPk(clubId);

        if (!club) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //check etudiant id
        const etudiantId = parseInt(req.body.etudiantId);
        const etudiant = await Etudiant.findByPk(etudiantId);

        if (!etudiantId || !etudiant) {
            res.statusCode = 400;
            res.send("etudiantId invalid");
            return;
        }

        //add etudiant
        await club.removeMember(etudiant);

        //response
        res.statusCode = 200;
        res.send();
    },

    //president
    async presidentGet(req: Request, res: Response) {
        const clubId = parseInt(req.params.clubId);
        const club = await Club.findByPk(clubId);

        if (!club) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const presidentRole =  await (await club.getPresident()).getRole();
        const president = await presidentRole.getEtudiant();

        if (!president) {
            res.statusCode = 400;
            res.send("no president");
            return;
        }

        res.statusCode = 200;
        res.send(await president.getEtudiantInterface());
    },

    async presidentSet(req: Request, res: Response) {
        const clubId = parseInt(req.params.clubId);
        const club = await Club.findByPk(clubId);

        if (!club) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //check etudiant id
        const etudiantId = parseInt(req.body.etudiantId);
        const etudiant = await Etudiant.findByPk(etudiantId);

        if (!etudiantId || !etudiant) {
            res.statusCode = 400;
            res.send("etudiantId invalid");
            return;
        }

        //set role
        const presidentRole = await (await club.getPresident()).getRole();
        //remove old president
        const oldPresident = await presidentRole.getEtudiant();
        await oldPresident.removeRole(presidentRole);
        //set new president
        await etudiant.addRole(presidentRole);

        res.statusCode = 200;
        res.send();
    },


};