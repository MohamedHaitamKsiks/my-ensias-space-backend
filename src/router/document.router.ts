import express, { Request, Response } from "express";
import { docuemntController } from "../controller/document.controller";

//create router
export const documentRouter = express.Router();

//test request
documentRouter.get('/', docuemntController.getAll);

documentRouter.post('/add', docuemntController.add);

documentRouter.post('/edit/:documentId', docuemntController.edit);

documentRouter.post('/delete/:documentId', docuemntController.delete);
