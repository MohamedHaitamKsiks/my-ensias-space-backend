import express, { Request, Response } from "express";
import { matiereController } from "../controller/matiere.controller";

//create router
export const matiereRouter = express.Router();

matiereRouter.get('/', matiereController.getAll);

matiereRouter.post('/add', matiereController.add);

matiereRouter.post('/edit/:matiereId', matiereController.edit);

matiereRouter.post('/delete/:matiereId', matiereController.delete);

matiereRouter.get('/:matiereId', matiereController.get);
