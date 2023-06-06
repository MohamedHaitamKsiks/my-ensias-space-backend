import { Request, Response } from "express";
import { Poste, PosteInterface } from "../model/forum/post.model";
import { Forum, ForumInterface } from "../model/forum/forum.mode";
import { Document } from "../model/document.model";


export const forumController = {

    async get(req: Request, res: Response) {

    },

    async getAll(req: Request, res: Response) {
        const forums = await Forum.findAll();
        const forumsInterface : Array<ForumInterface> = [];

        for (let i = 0; i < forums.length; i++) {
            forumsInterface.push(forums[i].getForumInterface())
        }

        res.statusCode = 200;
        res.send(forumsInterface);
    },

    async add(req: Request, res: Response) {
        const etudiant = req.session.etudiant;
        if(!etudiant)
            return;

        const sujet = req.body.sujet;
        if (!sujet) {
            res.statusCode = 400;
            res.send("sujet missing!");
            return; 
        }

        //create forum 
        const createdForum = await etudiant.createForum(sujet, sujet);
        if (!createdForum) {
            res.statusCode = 400;
            res.send("forum not created");
            return;
        }

        res.statusCode = 200;
        res.send(createdForum.getForumInterface());
    },

    async edit(req: Request, res: Response) {
        const forumId = parseInt(req.params.forumId);
        let forum = await Forum.findByPk(forumId);
        if (!forum) {
            res.statusCode = 404;
            res.send();
            return;
        }


        const newSujet = req.body.sujet;
        if (newSujet) 
            forum.sujet = newSujet;
        forum = await forum.save();
        
        res.statusCode = 200;
        res.send(forum.getForumInterface());
    },

    async close(req: Request, res: Response) {

    },

    async delete(req: Request, res: Response) {

    },

    //acces
    async accesGet(req: Request, res: Response) {

    },

    async accesAdd(req: Request, res: Response) {

    },

    async accesDelete(req: Request, res: Response) {

    },

    //postes
    async posteGet(req: Request, res: Response) {
        const forumId = parseInt(req.params.forumId);
        let forum = await Forum.findByPk(forumId);
        if (!forum) {
            res.statusCode = 404;
            res.send();
            return;
        }
        
        const posts = await forum.getPostes();
        let postsInterface: Array<PosteInterface> = [];

        for (let i = 0; i < posts.length; i++) {
            postsInterface.push(await posts[i].getPosteInterface());
        }

        res.statusCode = 200;
        res.send(postsInterface);
        
    },

    async posteAdd(req: Request, res: Response) {
        const forumId = parseInt(req.params.forumId);
        let forum = await Forum.findByPk(forumId);
        if (!forum) {
            res.statusCode = 404;
            res.send();
            return;
        }

        const etudiant = req.session.etudiant;
        if (!etudiant)
            return;

        const newPoste = {
            texte: req.body.texte,
            documents: req.body.documents
        };

        let poste = await etudiant.postInForum(forum, newPoste.texte);
        
        if (!poste){
            res.statusCode = 400;
            res.send("can't poste in this forum!");
            return;
        }

        //add documents
        for (let i = 0; i < newPoste.documents.length; i++) {
            const document = await Document.findByPk(newPoste.documents[i]);
            if (!document)
                continue; 
            
            await poste.addDocument(document);
            await document.saveDocument();
        }

        res.statusCode = 200;
        res.send(await poste.getPosteInterface());

    },

    async posteEdit(req: Request, res: Response) {
        //check forum 
        const forumId = parseInt(req.params.forumId);
        let forum = await Forum.findByPk(forumId);
        if (!forum) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //check poste
        const posteId = parseInt(req.body.posteId);
        let poste = await Poste.findByPk(posteId);
        if (!poste) {
            res.statusCode = 400;
            res.send();
            return;
        }

        //edit poste
        const newTexte = req.body.texte;
        if (newTexte) {
            poste.texte = newTexte;
            await poste.save();
        }

        res.statusCode = 200;
        res.send(await poste.getPosteInterface());

    },

    async posteDelete(req: Request, res: Response) {
        //check forum 
        const forumId = parseInt(req.params.forumId);
        let forum = await Forum.findByPk(forumId);
        if (!forum) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //check poste
        const posteId = parseInt(req.body.posteId);
        let poste = await Poste.findByPk(posteId);
        if (!poste) {
            res.statusCode = 400;
            res.send("posteId invalid!");
            return;
        }

        await poste.destroy();

        res.statusCode = 200;
        res.send();
    },

    async posteAddDocument(req: Request, res: Response) {
        //check forum 
        const forumId = parseInt(req.params.forumId);
        let forum = await Forum.findByPk(forumId);
        if (!forum) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //check poste
        const posteId = parseInt(req.body.posteId);
        let poste = await Poste.findByPk(posteId);
        if (!poste) {
            res.statusCode = 400;
            res.send("posteId invalid!");
            return;
        }

        //check document
        const documentId = parseInt(req.body.documentId);
        let document = await Document.findByPk(documentId);
        if (!document) {
            res.statusCode = 400;
            res.send("documentId invalid!");
            return;
        }

        poste.addDocument(document);
        document.saveDocument();

        document = await document.reload();

        res.statusCode = 200;
        res.send(document.getDocumentInterface());
    },

    async posteRemoveDocument(req: Request, res: Response) {
        //check forum 
        const forumId = parseInt(req.params.forumId);
        let forum = await Forum.findByPk(forumId);
        if (!forum) {
            res.statusCode = 404;
            res.send();
            return;
        }

        //check poste
        const posteId = parseInt(req.body.posteId);
        let poste = await Poste.findByPk(posteId);
        if (!poste) {
            res.statusCode = 400;
            res.send("posteId invalid!");
            return;
        }

        //check document
        const documentId = parseInt(req.body.documentId);
        let document = await Document.findByPk(documentId);
        if (!document) {
            res.statusCode = 400;
            res.send("documentId invalid!");
            return;
        }

        poste.removeDocument(document);
        document.destroy();

        res.statusCode = 200;
        res.send();
    },
};