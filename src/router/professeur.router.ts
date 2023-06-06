import express, { Request, Response } from "express";
import { professeurController } from "../controller/professeur.controller";

//create router
export const professeurRouter = express.Router();


professeurRouter.get('/', professeurController.getAll);

professeurRouter.post('/add', professeurController.add);

professeurRouter.post('/edit/:professeurId', professeurController.edit);

professeurRouter.post('/delete/:professeurId', professeurController.delete);

professeurRouter.get('/:professeurId', professeurController.get);


professeurRouter.get('/matiere/:professeurId', professeurController.matiereGet);

professeurRouter.post('/matiere/add/:professeurId', professeurController.matiereAdd);

professeurRouter.post('/matiere/delete/:professeurId', professeurController.delete);