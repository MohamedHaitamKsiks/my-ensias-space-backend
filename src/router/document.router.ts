import express, { Request, Response } from "express";
import multer, { Field, Multer } from "multer"
import { documentController } from "../controller/document.controller";
import {v4 as uuidv4} from "uuid"

//upload
const storage = multer.diskStorage({
    destination: 'uploads/.tmp/',
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueFileName = `${ uuidv4() }.${ file.originalname }`;
        cb(null, uniqueFileName);
    }
});
const upload = multer({
    storage: storage
})

//create router
export const documentRouter = express.Router();


documentRouter.post('/add',upload.single('document'), documentController.add);

documentRouter.get('/file/:documentId', documentController.getFile);

documentRouter.post('/delete/:documentId', documentController.delete);
