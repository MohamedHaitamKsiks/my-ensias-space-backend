import { Request, Response } from "express";
import { Classe } from "../model/classe.model";
import { Emploi, EmploiInterface } from "../model/emploi/emploi.model";
import { Timeline, TimelineInterface } from "../model/emploi/timeline.model";
import { time } from "console";


export const emploiController = {

    async get(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const emplois = await classe.getEmplois();
        let emploisInterface: Array<EmploiInterface> = [];

        for (let i = 0; i < emplois.length; i++) {
            emploisInterface.push(await emplois[i].getEmploiInterface());
        }

        res.statusCode = 200;
        res.send(emploisInterface);
    },

    async add(req: Request, res: Response) {
        
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);
        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //get new emploi fields
        const newEmploi = {
            semaine: req.body.semaine,
            semestre: req.body.semestre
        }
        if (!newEmploi.semaine || !newEmploi.semestre) {
            res.statusCode = 400;
            res.send("invalid fields!");
            return;
        }
    
        const emploi = await Emploi.create(newEmploi);
        await classe.addEmploi(emploi);

        res.statusCode = 200;
        res.send(await emploi.getEmploiInterface());
    },

    async edit(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //get new emploi fields
        const newEmploi = {
            emploiId: parseInt(req.body.emploiId),
            semaine: req.body.semaine,
            semestre: req.body.semestre
        }

        //get emploi
        let emploi = await Emploi.findByPk(newEmploi.emploiId);
        if (!emploi) {
            res.statusCode = 404;
            res.send();
            return;
        }

        if (newEmploi.semaine)
            emploi.semaine = newEmploi.semaine;

        if (newEmploi.semestre)
            emploi.semestre = newEmploi.semestre;

        //save changes
        emploi = await emploi.save();
        res.statusCode = 200;
        res.send(await emploi.getEmploiInterface())
    
    },

    async delete(req: Request, res: Response) {
        const classeId = parseInt(req.params.classeId);
        const classe = await Classe.findByPk(classeId);

        if (!classe) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //get emploi
        const emploiId = parseInt(req.body.emploiId)
        let emploi = await Emploi.findByPk(emploiId);
        if (!emploi) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //save changes
        await emploi.destroy();
        res.statusCode = 200;
        res.send(await emploi.getEmploiInterface())

    },

    //timeline
    async timelinesGet(req: Request, res: Response) {
        const emploiId = parseInt(req.params.emploiId);
        const emploi = await Emploi.findByPk(emploiId);

        if (!emploi) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const timelines = await emploi.getTimelines();
        let timelinesInterface: Array<TimelineInterface> = [];

        for (let i = 0; i < timelines.length; i++) {
            timelinesInterface.push(timelines[i].getTimelineInterface());
        }

        res.statusCode = 200;
        res.send(timelinesInterface);

    
    },

    async timelineAdd(req: Request, res: Response) {
        const emploiId = parseInt(req.params.emploiId);
        const emploi = await Emploi.findByPk(emploiId);

        if (!emploi) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //get new emploi fields
        const newTimeline = {
            jour: parseInt(req.body.jour),
            debut: parseFloat(req.body.debut),
            fin: parseFloat(req.body.fin)
        }
        if (!newTimeline.jour || !newTimeline.debut || !newTimeline.fin) {
            res.statusCode = 400;
            res.send("invalid fields!");
            return;
        }

        const timeline = await Timeline.create(newTimeline);
        await emploi.addTimeline(timeline);

        res.statusCode = 200;
        res.send(timeline.getTimelineInterface());

    },

    async timelineEdit(req: Request, res: Response) {
        const emploiId = parseInt(req.params.emploiId);
        const emploi = await Emploi.findByPk(emploiId);
        if (!emploi) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //get new emploi fields
        const newTimeline = {
            id: parseInt(req.body.timelineId),
            jour: parseInt(req.body.jour),
            debut: parseFloat(req.body.debut),
            fin: parseFloat(req.body.fin)
        }

        let timeline = await Timeline.findByPk(newTimeline.id);
        if (!timeline) {
            res.statusCode = 400;
            res.send("invalid timelineId");
            return;
        }

        //edit timeline
        if (newTimeline.jour)
            timeline.jour = newTimeline.jour;
        if (newTimeline.debut)
            timeline.debut = newTimeline.debut;
        if (newTimeline.fin)
            timeline.fin = newTimeline.fin;

        //save timeline
        timeline = await timeline.save();

        res.statusCode = 200;
        res.send(timeline.getTimelineInterface());
    },

    async timelineRemove(req: Request, res: Response) {
        const emploiId = parseInt(req.params.emploiId);
        const emploi = await Emploi.findByPk(emploiId);

        if (!emploi) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //get new emploi fields
        const timelineId = parseInt(req.body.timelineId);
        let timeline = await Timeline.findByPk(timelineId);
        if (!timeline) {
            res.statusCode = 400;
            res.send("invalid timelineId");
            return;
        }

        //save timeline
        await timeline.destroy();

        res.statusCode = 200;
        res.send();
    },

};