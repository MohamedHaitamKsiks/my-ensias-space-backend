import express, { Request, Response } from "express";
import { etudiantController } from "../controller/etudiant.controller";

//create router
export const etudiantRouter = express.Router();


etudiantRouter.get('/', etudiantController.getAll);

etudiantRouter.post('/add', etudiantController.add);

etudiantRouter.post('/delete/:etudiantId', etudiantController.delete);

etudiantRouter.get('/:etudiantId', etudiantController.get);  

etudiantRouter.get('/roles/:etudiantId', etudiantController.getRoles);

etudiantRouter.post('/edit/:etudiantId', etudiantController.edit);

