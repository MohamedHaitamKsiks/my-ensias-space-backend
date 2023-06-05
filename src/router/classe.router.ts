import express, { Request, Response } from "express";
import { classeController } from "../controller/classe.controller";

//create router
export const classeRouter = express.Router();


classeRouter.get('/', classeController.getAll);

classeRouter.get('/:classeId', classeController.get);

classeRouter.post('/add', classeController.add);

classeRouter.post('/delete/:classeId', classeController.delete);

classeRouter.post('/edit/:classeId', classeController.edit);


classeRouter.get('/delegue/:classeId', classeController.getDelegue);

classeRouter.post('/delegue/:classeId', classeController.setDelegue);


classeRouter.get('/etudiant/:classeId', classeController.getEtudiants);

classeRouter.post('/etudiant/add/:classeId', classeController.addEtudiant);

classeRouter.post('/etudiant/delete/:classeId', classeController.removeEtudiant);
