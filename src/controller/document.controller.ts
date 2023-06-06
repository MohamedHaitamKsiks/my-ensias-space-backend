import { Request, Response } from "express";
import { Document, DocumentType } from "../model/document.model";
import fs from "fs/promises"

export const documentController = {

    async get(req: Request, res: Response) {

    },

    async getAll(req: Request, res: Response) {

    },

    async add(req: Request, res: Response) {
        const documentFile = req.file;
        if (!documentFile) {
            res.statusCode = 400;
            res.send();
            return;
        }

        const document = await Document.create({
            nom: documentFile.filename.substring(documentFile.filename.indexOf('.') + 1),
            path: documentFile.filename,
            type: DocumentType.OTHER
        });

        if (!document) {
            res.statusCode = 400;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.send(document.getDocumentInterface());
    },

    async getFile(req: Request, res: Response) {
        const documentId = parseInt(req.params.documentId);
        const document = await Document.findByPk(documentId);
        
        if (!document) {
            res.statusCode = 404;
            res.send();
            return;
        }

        res.statusCode = 200;
        res.sendFile(document.getFilePath());
    },

    async delete(req: Request, res: Response) {
        const documentId = parseInt(req.params.documentId);
        const document = await Document.findByPk(documentId);

        if (!document) {
            res.statusCode = 404;
            res.send();
            return;
        }

        await fs.rm(document.getFilePath());
        await document.destroy();
        
        res.statusCode = 200;
        res.send();
    },

};